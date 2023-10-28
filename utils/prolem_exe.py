import redis
import json

#
# redis connnection
# obj = redis.Redis(decode_responses=True)
#
# payload = [{'id': 1, 'name': 'abc'}, {"id": 2, "name": 'abc3'}]
# for index, x in enumerate(payload, start=1):
#     obj.hset(dict_name, key.format(index), json.dumps(x))
# print('====================')
# data = obj.hgetall("employee_data")
# print(data.get('emp-1'))
# emp_1 = json.loads(data.get('emp-1'))
# print(type(emp_1), emp_1)
#
# #
# is_exist = obj.hget(dict_name, key.format(1))
#
# # print({} if is_exist is None else is_exist)
# print(obj.hexists(dict_name, key.format(3)))
# print(obj.hgetall(dict_name))
# print('====================')
#

class RedisKeyNotExist(Exception):
    def __init__(self):
        self.msg = 'key does not exist'


class RCrud:
    r = redis.Redis(decode_responses=True)
    dict_name = None
    key_template = None
    pk = 'id'


    @classmethod
    def get(cls, key, dict_name=None):
        return cls.r.hget(dict_name or cls.dict_name, cls.key_template.format(key))

    @classmethod
    def get_all(cls, dict_name=None):
        return cls.r.hgetall(dict_name or cls.dict_name)

    @classmethod
    def save(cls, payload: dict, dict_name: str = None):
        pk = payload.get(cls.pk)
        if not pk:
            raise RedisKeyNotExist()

        if not isinstance(payload, dict):
            raise Exception('input need to be a type of dict')

        return cls.r.hset(dict_name or cls.dict_name, cls.key_template.format(pk), json.dumps(payload))

    @classmethod
    def delete(cls, key, dict_name=None):
        return cls.r.hdel(dict_name or cls.dict_name, cls.key_template.format(key))


class NoteCrud(RCrud):
    dict_name = 'cache_note'
    key_template = 'note:{}'


if __name__ == '__main__':
    NoteCrud.save({"payload": 200})
    obj = NoteCrud.get(200)
    print(obj)
