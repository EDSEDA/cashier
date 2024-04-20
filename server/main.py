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
# def create_id():
#     global next_id
#     next_id = next_id + 1
#     return next_id - 1


kafka_client = KafkaClient("localhost:9092")

clients_map = {'192.168.50.229': 1}
clients = {}
# Серверные ручки, триггерятся сообщениями кафки
@kafka_client.register_topic_handler(settings.RECOMMENDATION_RESPONSE_TOPIC, msg_class=UserRecommendationMessage)
async def update_items(update_recommendation: UserRecommendationMessage):
    try:
        info(f'Sending recommendations: {update_recommendation}')

        connection = clients[update_recommendation.cash_register_id]
        await connection.send(','.join(update_recommendation.recommendations))

        info(f'Recommendations sent: {update_recommendation}')
    except Exception as e:
        info(f'Error code: {e}')


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
    clients[clients_map[websocket.host]] = websocket
    print(f"New client [{id}] connected: {websocket.remote_address}")

    # kafka_client.send_message(settings.CASHIER_INTERACTIONS_TOPIC, RequestUpdateMessage(
    #     cash_register_id=id,
    # ))

    try:
        while True:
            async for message in websocket:
                if message == "Connection established":
                    continue
                parts = message.split(SEPARATOR)
                if len(parts) < 2:
                    error(f'Invalid message {message}')
                    continue

                event_name = parts[0]
                data = json.loads(parts[1])
                if event_name not in handlers:
                    error(f'No such event {event_name} with data {data}')
                    continue

                # await handlers[event_name](data, id)

    except websockets.ConnectionClosed:
        # Remove the disconnected client from the list
        del clients[id]
        print(f"Client [{id}] disconnected: {websocket.remote_address}")


async def main():
    async with websockets.serve(connection_handler, "192.168.50.229", 8765):
        await kafka_client.start_handling()
        # await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
