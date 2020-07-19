"""Serializers repository - convert json to models and vice versa"""
from rest_framework import serializers

from webapp.models import City, Placetype, Cafe, Review, Country, Photo


class CitySerializer(serializers.ModelSerializer):
    """City Serializer"""
    country = serializers.StringRelatedField()

    class Meta:
        model = City
        # fields = ["name", "latitude", "longitude"]
        fields = "__all__"

class CountrySerializer(serializers.ModelSerializer):
    """Country Serializer"""
    class Meta:
        model = Country
        fields = "__all__"

class PlacetypeSerializer(serializers.ModelSerializer):
    """Placetype Serializer"""
    cafes = serializers.StringRelatedField(many=True)
    class Meta:
        model = Placetype
        fields = "__all__"


class PhotoSerializer(serializers.ModelSerializer):
    """Photo Serializer"""
    class Meta:
        model = Photo
        fields = "__all__"


class CafeSerializer(serializers.ModelSerializer):
    """Cafe Serializer"""
    placetypes = serializers.StringRelatedField(many=True, required=False)
    photos = serializers.SerializerMethodField()
    raw_word_cloud = serializers.SerializerMethodField('get_word_cloud', required=False)
    dn_score = serializers.SerializerMethodField('get_dn_score', required=False)

    def get_word_cloud(self, model):
        if hasattr(model, 'raw_word_cloud'):
            return model.raw_word_cloud
        else:
            return None

    def get_dn_score(self, model):
        if hasattr(model, 'dn_score'):
            return model.dn_score
        else:
            return None

    def get_photos(self, obj):
        photos = obj.photo_set.all()[:3]
        return PhotoSerializer(photos, many=True).data

    class Meta:
        model = Cafe
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    """Review Serializer"""
    class Meta:
        model = Review
        fields = "__all__"