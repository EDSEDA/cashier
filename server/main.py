import asyncio
import websockets
import json
from logging import info, error

from grifon.config import settings
from grifon.mqbroker.kafka_client import KafkaClient
from grifon.recommendation.schema import UserRecommendationMessage
from grifon.cashier.schema import RequestUpdateMessage, AddItemAndRequestUpdateMessage


SEPARATOR = ':'

next_id = 0
def create_id():
    next_id = next_id + 1
    return next_id - 1


kafka_client = KafkaClient("localhost:9092")

clients = map()


# Серверные ручки, триггерятся сообщениями кафки
@kafka_client.register_topic_handler(settings.RECOMMENDATION_RESPONSE_TOPIC, msg_class=UserRecommendationMessage)
async def update_items(update_recommendation: UserRecommendationMessage):
    try:
        info(f'Sending recommendations: {update_recommendation}')

        connection = clients[update_recommendation.cash_register_id]
        await connection.send(update_recommendation.recommendations)

        info(f'Recommendations sent: {update_recommendation}')
    except Exception as e:
        error(e)


# хендлеры клиентских сообщений, отправляют сообщения в кафку
async def add_item_handler(data, cash_register_id):
    if 'itemId' not in data:
        error('No itemId provided')
        return
    kafka_client.send_message(settings.CASHIER_INTERACTIONS_TOPIC, AddItemAndRequestUpdateMessage(
        cash_register_id=cash_register_id,
        itemId=data.itemId,
    ))


handlers = {
    'addItem': add_item_handler,
}

async def connection_handler(websocket):
    id = create_id()
    clients[id] = websocket
    print(f"New client [{id}] connected: {websocket.remote_address}")

    kafka_client.send_message(settings.CASHIER_INTERACTIONS_TOPIC, RequestUpdateMessage(
        cash_register_id=id,
    ))

    try:
        async for message in websocket:
            parts = message.decode('utf-8').split(SEPARATOR)
            if parts.length < 2:
                error(f'Invalid message {message}')
                return

            event_name = parts[0]
            data = json.loads(parts[1])
            if event_name not in handlers:
                error(f'No such event {event_name} with data {data}')
                return

            await handlers[event_name](data, id)

    except websockets.ConnectionClosed:
        # Remove the disconnected client from the list
        del clients[id]
        print(f"Client [{id}] disconnected: {websocket.remote_address}")


async def main():
    async with websockets.serve(connection_handler, "localhost", 8765):
        asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
