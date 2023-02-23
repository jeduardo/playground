#!/usr/bin/env python3

import datetime
import redis

from functools import lru_cache
from redis_lru import RedisLRU


r = redis.Redis(host='localhost', port=6379, db=0)
cache = RedisLRU(r)


@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)


@cache(expire_on=datetime.datetime.now()+datetime.timedelta(minutes=5))
def fib2(n):
    if n < 2:
        return n
    return fib2(n-1) + fib2(n-2)


print([fib(n) for n in range(16)])
print(fib.cache_info())

print([fib2(n) for n in range(16)])
