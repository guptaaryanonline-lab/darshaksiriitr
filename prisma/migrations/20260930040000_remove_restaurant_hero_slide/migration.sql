-- Hero slide 1 was a team photo taken at a restaurant (dining tables and
-- plates in frame). Remove it, but only if it is still that exact slide;
-- slides added or edited from the admin panel are never touched.
DELETE FROM "HeroSlide"
WHERE "id" = 'default-hero-1'
  AND "image" = '/images/20231110_210617.jpg';
