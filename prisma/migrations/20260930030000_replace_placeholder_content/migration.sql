-- Corrects placeholder content that reached the live site. Every statement
-- only matches rows that are provably placeholders, so real content entered
-- from the admin panel is never touched, and re-running is harmless.

-- 1. Hero slide 2 was a restaurant/food photo by mistake: use the
--    Technology Innovators stage photo instead (only if still unchanged).
UPDATE "HeroSlide"
SET "image" = '/images/20230703_143246.jpg',
    "caption" = 'Technology Innovators award ceremony',
    "position" = 'center',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'default-hero-2'
  AND "image" = '/images/20240721_174225.jpg';

-- 2. Remove the five placeholder publications (their DOIs were not real)...
DELETE FROM "Publication"
WHERE "doi" IN (
  '10.1109/ISCAS46773.2023.10181234',
  '10.1109/IWCMC58020.2023.10182345',
  '10.1109/LAMC50424.2020.9339432',
  '10.1109/Austrochip56888.2022.9912345',
  '10.1109/TCSII.2024.3378901'
);

-- ...and add the real publication list from the original site, skipping any
-- title that already exists (e.g. if it was entered by hand in the meantime).
INSERT INTO "Publication" ("id", "title", "authors", "type", "year", "journal", "conference", "volume", "pages", "sortOrder", "updatedAt")
SELECT v."id", v."title", v."authors", v."type", v."year", v."journal", v."conference", v."volume", v."pages", v."sortOrder", CURRENT_TIMESTAMP
FROM (VALUES
  ('real-pub-01', 'A High Isolation Linear Subharmonic Mixer for Q-Band Application', 'Srivastava G, Bhatt D', 'Conference', 2023, NULL, '2023 International Wireless Communications and Mobile Computing (IWCMC)', NULL, '1395-1399', 1),
  ('real-pub-02', 'Ultra Wideband Low Noise N-path Direct Conversion Receiver for 5G-advanced and 6G Wireless System', 'Kumari A, Bhatt D', 'Conference', 2023, NULL, '2023 IEEE International Symposium on Circuits and Systems (ISCAS)', NULL, NULL, 2),
  ('real-pub-03', 'A Wideband Noise Cancelling Mixer in 130-nm BiCMOS Process', 'Guruprakashkumar P, Bhatt D', 'Conference', 2022, NULL, '2022 IEEE Microwaves, Antennas, and Propagation Conference (MAPCON)', NULL, '1461-1465', 3),
  ('real-pub-04', 'A Low-Noise Transconductance Amplifier (LNTA) for Cryogenic Applications using CMOS Technology', 'Kamparaju G, Bhatt D', 'Conference', 2022, NULL, '2022 Austrochip Workshop on Microelectronics (Austrochip)', NULL, '61-64', 4),
  ('real-pub-05', 'Advanced System Analysis and Survey on the GPS Receiver Front End', 'Kumari A, Bhatt D', 'Journal', 2022, 'IEEE Access', NULL, NULL, NULL, 5),
  ('real-pub-06', 'A 17-32 GHz Wideband High Isolation Linear mm-Wave Mixer For 5G applications', 'Srivastava G, Bhatt D', 'Conference', 2021, NULL, '2020 IEEE MTT-S Latin America Microwave Conference (LAMC 2020)', NULL, NULL, 6),
  ('real-pub-07', 'Design of Wideband Active Mixer by using an Active Inductor', 'Bhatt D', 'Conference', 2019, NULL, '2019 IEEE Asia-Pacific Microwave Conference (APMC)', NULL, '1173-1175', 7),
  ('real-pub-08', 'Study and Design of Integrated Mixer and LNA Topologies for WiFi and Wideband Systems with a High Immunity to Parasitic Signal Feedthrough', 'Bhatt DK', 'Thesis', 2018, NULL, 'PhD Thesis, Monash University', NULL, NULL, 8),
  ('real-pub-09', 'Low-power switched transconductance mixer and LNA design for Wi-Fi and WiMAX applications in 65 nm CMOS', 'Bhatt D, Mukherjee J, Redouté JM', 'Journal', 2018, 'IET Microwaves, Antennas & Propagation', NULL, '12', '1736-1744', 9),
  ('real-pub-10', 'A 1-11 GHz ultra-wideband LNA using M-derived inductive peaking circuit in UMC 65 nm CMOS', 'Bhatt D, Mukherjee J, Redouté JM', 'Journal', 2017, 'Microwave and Optical Technology Letters', NULL, '59', '521-526', 10),
  ('real-pub-11', 'A Self-Biased Mixer in 0.18um CMOS for an Ultra-Wideband Receiver', 'Bhatt D, Mukherjee J, Redouté JM', 'Journal', 2017, 'IEEE Transactions on Microwave Theory and Techniques', NULL, '65', '1294-1302', 11),
  ('real-pub-12', 'Multi Mode Resonators Based Triple Band Notch UWB Filter', 'Kamma A, Das R, Bhatt D, Mukherjee J', 'Journal', 2017, 'IEEE Microwave and Wireless Components Letters', NULL, '27', '120-122', 12),
  ('real-pub-13', 'Low-Power Linear Bulk-Injection Mixer for Wide-Band Applications', 'Bhatt D, Mukherjee J, Redouté JM', 'Journal', 2016, 'IEEE Microwave and Wireless Components Letters', NULL, '26', '828-830', 13),
  ('real-pub-14', 'A high-isolation linear folded mixer for ISM band in UMC 180NM CMOS technology', 'Bhatt D, Mukherjee J, Redouté JM', 'Journal', 2016, 'Microwave and Optical Technology Letters', NULL, '58', '2461-2466', 14),
  ('real-pub-15', 'A high isolation linear folded mixer for WiFi applications', 'Bhatt D, Mukherjee J, Redoute JM', 'Conference', 2014, NULL, '2014 IEEE International Symposium on Circuits and Systems (ISCAS)', NULL, '694-697', 15)
) AS v("id", "title", "authors", "type", "year", "journal", "conference", "volume", "pages", "sortOrder")
WHERE NOT EXISTS (
  SELECT 1 FROM "Publication" p WHERE lower(p."title") = lower(v."title")
)
ON CONFLICT ("id") DO NOTHING;

-- 3. Placeholder students carried made-up details (employers such as
--    Qualcomm / Texas Instruments and dummy profile links). Clear those
--    details from the placeholder rows only; real students are not matched.
UPDATE "Student"
SET "workplace" = NULL,
    "scholarLink" = NULL,
    "linkedinLink" = NULL,
    "researchStatement" = NULL,
    "joiningYear" = NULL,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "name" IN ('RISHI Lab Scholar', 'M.Tech Research Student', 'RISHI Lab Alumnus', 'M.Tech Alumnus');
