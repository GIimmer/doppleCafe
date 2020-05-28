from django.db import models

# Create your models here.

class City(models.Model):
    name = models.CharField("Name", max_length=255)
    latitude = models.DecimalField("Latitude", max_digits=10, decimal_places=8)
    longitude = models.DecimalField("Longitude", max_digits=11, decimal_places=8)
    country = models.ForeignKey("Country", on_delete=models.CASCADE, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Country(models.Model):
    countryCode = models.CharField("CountryCode", max_length=255, default="Unset")

    def __str__(self):
        return self.countryCode


class Placetype(models.Model):
    name = models.CharField("Name", max_length=255)

    def __str__(self):
        return self.name

class Cafe(models.Model):
    place_id = models.CharField("PlaceId", max_length=255, primary_key=True)
    name = models.CharField("Name", max_length=255)
    price_level = models.PositiveSmallIntegerField("PriceLevel", null=True, blank=True)
    hours = models.CharField("Hours", max_length=255, default="unset", null=True, blank=True)
    rating = models.DecimalField("Rating", max_digits=2, decimal_places=1, null=True, blank=True)
    user_ratings_total = models.IntegerField("UserRatingsTotal", null=True, blank=True)
    formatted_address = models.CharField("Addr", max_length=255, default="unset", null=True, blank=True)
    compound_code = models.CharField('CompoundCode', max_length=255, null=True)
    website = models.CharField('Website', max_length=255, null=True, blank=True)
    formatted_phone_number = models.CharField('FormattedPhoneNumber', max_length=255, null=True, blank=True)
    city = models.ForeignKey("City", on_delete=models.CASCADE, null=True, blank=True)
    lat = models.DecimalField('Latitude', decimal_places=8, max_digits=10, null=True, blank=True)
    lng = models.DecimalField('Longitude', decimal_places=8, max_digits=11, null=True, blank=True)
    placetypes = models.ManyToManyField(Placetype)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    review_id = models.CharField("ReviewId", max_length=255, primary_key=True)
    reviewer = models.CharField("Reviewer", max_length=255)
    datetime = models.CharField("DateTime", max_length=30)
    rating = models.PositiveSmallIntegerField("Rating")
    text = models.TextField("Text")
    cafe = models.ForeignKey("Cafe", on_delete=models.CASCADE, blank=True)

    @classmethod
    def create(cls, data, cafe):
        review = cls(
            review_id=data['id'],
            reviewer=data['reviewer'], 
            datetime=data['datetime'], 
            rating=data['rating'], 
            text=data['text'],
            cafe=cafe
        )
        return review

    def __str__(self):
        return self.reviewer + " said " + self.text + " regarding cafe: " + self.cafe.name

class Photo(models.Model):
    photo_ref = models.CharField("ReferenceID", max_length=255)
    html_attr = models.CharField("PhotographerLink", max_length=255, blank=True)
    height = models.PositiveSmallIntegerField("Height", blank=True)
    width = models.PositiveSmallIntegerField("Width", blank=True)
    cafe = models.ForeignKey("Cafe", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return "Photo for: " + self.cafe.name
