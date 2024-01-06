import logging
import os


def set_logger():
    logger = logging.getLogger(__name__)

    logger.setLevel(logging.INFO)
    formatter = logging.Formatter(
        "%(asctime)s:%(filename)s:%(levelname)s:%(lineno)d:%(message)s", "%d-%b-%y %H:%M:%S"
    )
    file_handler = logging.FileHandler("errors.log")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

    return logger


logger = set_logger()
