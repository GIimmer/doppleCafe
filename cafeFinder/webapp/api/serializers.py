"""Serializers repository - convert json to models and vice versa"""
from rest_framework import serializers

from webapp.models import City, Placetype, Cafe, Review, Country


class CitySerializer(serializers.ModelSerializer):
    """City Serializer"""
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

class CafeSerializer(serializers.ModelSerializer):
    """Cafe Serializer"""
    placetypes = serializers.StringRelatedField(many=True)
    class Meta:
        model = Cafe
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    """Review Serializer"""
    review_id = serializers.CharField(source='id')
    class Meta:
        model = Review
        fields = "__all__"