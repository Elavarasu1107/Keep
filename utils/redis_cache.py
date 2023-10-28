import json

import redis
from django.conf import settings


class RedisBaseManager:
    redis_client = redis.Redis(**settings.REDIS_CONFIG)

    def getter(self, key):
        return self.redis_client.get(key)

    def setter(self, key, value):
        return self.redis_client.set(key, value)


class RedisManager(RedisBaseManager):
    def save(self, notes, user_id):
        data = {}
        for x, y in notes.items():
            if x in ["label", "collaborator"]:
                data.update({x: list(y)})
            else:
                data.update({x: y})
        cache_notes = self.getter(str(user_id))
        cache_notes = json.loads(cache_notes) if cache_notes else {}
        instance_id = data.get("id")
        cache_notes.update({str(instance_id): data})
        self.setter(str(user_id), json.dumps(cache_notes))

    def get(self, user_id):
        cache_notes = self.getter(str(user_id))
        if not cache_notes:
            return None
        notes = json.loads(cache_notes).values()
        return notes

    def delete(self, note_id, user_id):
        cache_notes = self.getter(str(user_id))
        if not cache_notes:
            return
        cache_notes = json.loads(cache_notes)
        note = cache_notes.get(str(note_id))
        if note:
            cache_notes.pop(str(note_id))
            self.setter(str(user_id), json.dumps(cache_notes))

    def hget_notes_user(self, user_id):
        notes = self.redis_client.hgetall(user_id)
        notes = [json.loads(x) for x in notes.values()]
        return notes

    def hset_notes(self, user_id, notes):
        data = {}
        for x, y in notes.items():
            if x in ["label", "collaborator"]:
                data.update({x: list(y)})
            else:
                data.update({x: y})
        self.redis_client.hset(user_id, notes.get('id'), json.dumps(data))

    def hdel_notes(self, user_id, note_id):
        print(user_id, note_id)
        self.redis_client.hdel(user_id, note_id)
