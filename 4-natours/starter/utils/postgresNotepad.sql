SELECT "difficulty",
    COUNT("duration") AS "numTours",
    AVG("ratingsAverage") AS "avgRating",
    AVG("price") AS "avgPrice",
    MIN("price") AS "minPrice",
    MAX("price") AS "maxPrice",
    SUM("ratingsQuantity") AS "numRatings"
FROM "tours" AS "tours"
GROUP BY "difficulty";
--SELECT * FROM tours;
-- lecture 102
-- SELECT *,UNNEST("startDates") AS "unwound"
-- FROM tours