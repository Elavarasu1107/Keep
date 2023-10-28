from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import exceptions


class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class APIRenderer(JSONRenderer):

    def render(self, data, accepted_media_type=None, renderer_context=None):
        resp: Response = renderer_context.get("response")
        response_dict = {"message": resp.status_text, "status": resp.status_code, 'data': data}
        if resp.status_code >= 400:
            response_dict["message"] = data.get("detail")
            del response_dict["data"]
        else:
            if isinstance(data, dict):
                response_dict["data"] = data.get("data") or data
                response_dict["message"] = data.get("message") or response_dict["message"]
        data = response_dict
        return super().render(data, accepted_media_type, renderer_context)


def verify_user(function):
    def wrapper(self, request):
        if not request.user.is_authenticated:
            raise exceptions.NotAuthenticated('Authentication credentials were not provided.')
        request.data.update({'user': request.user.id})
        return function(self, request)
    return wrapper
