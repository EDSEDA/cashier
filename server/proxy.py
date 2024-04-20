import asyncio
import websockets
import json
from logging import info, error

from grifon.config import settings
from grifon.mqbroker.kafka_client import KafkaClient
from grifon.recommendation.schema import UserRecommendationMessage


kafka_client = KafkaClient("localhost:9092")


@kafka_client.register_topic_handler(settings.RECOMMENDATION_RESPONSE_TOPIC)
async def handle_update_recommendation_message(update_recommendation: UserRecommendationMessage):
    try:
        update_recommendation = UserRecommendationMessage.parse_obj(json.loads(update_recommendation.value()))
        info(f'Sending recommendations: {update_recommendation}')

        # find cashier connection
        # send update

        await websocket.send(message)

        info(f'Recommendations sent: {update_recommendation}')
    except Exception as e:
        error(e)



async def consumer_handler(websocket):
    async for message in websocket:
        await consumer(message)


async def producer_handler(websocket):
    while True:
        message = await producer()
        await websocket.send(message)


async def handler(websocket):
    consumer_task = asyncio.create_task(consumer_handler(websocket))
    producer_task = asyncio.create_task(producer_handler(websocket))
    done, pending = await asyncio.wait(
        [consumer_task, producer_task],
        return_when=asyncio.FIRST_COMPLETED,
    )
    for task in pending:
        task.cancel()


async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
