import random
import logging
import time
import tempfile
import concurrent.futures

logging.basicConfig(level=logging.INFO)

def task(id: int) -> int:
    with tempfile.NamedTemporaryFile(prefix=f"task{id}-") as f:
        logging.info(f"[Task {id}] Starting task")
        logging.info(f"Created tempfile at {f.name}")
        seconds = random.randrange(1, 30)
        logging.info(f"[Task {id}] Sleeping for {seconds}...")
        time.sleep(seconds)
        logging.info(f"[Task {id}] Waking up and leaving")
        return id

def main() -> None:
    ids = [i for i in range(1, 10)]
    logging.info("Tasks prepared")
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=3)
    try:
        logging.info("Running tasks")
        results = executor.map(task, ids)
        logging.info("Waiting for results to complete...")
        logging.info(f"Immediate reference for tasks: {results}")
        executor.shutdown()
        logging.info(f"Tasks done: {results}")
        for result in results:
            logging.info(result)
    except KeyboardInterrupt as e:
        logging.info("Control-C pressed, bailing out")
        executor.shutdown(cancel_futures=True, wait=False)
        logging.info("Tasks aborted, exiting")
        


if __name__ == "__main__":
    main()
