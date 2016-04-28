--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.6
-- Dumped by pg_dump version 9.4.6
-- Started on 2016-04-17 15:39:36 PDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 175 (class 1259 OID 16784)
-- Name: citizen; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE citizen (
    username character varying(255),
    email character varying(255),
    password character varying(255),
    id integer NOT NULL,
    avatar character varying(255),
    twitter_id character varying(255),
    location character varying(255),
    twitter_token character varying(255),
    twitter_secret character varying(255),
    salt character varying(255)
);


--
-- TOC entry 173 (class 1259 OID 16776)
-- Name: protest; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE protest (
    name character varying(255),
    date date,
    submitted_by integer,
    event_id integer NOT NULL,
    description text,
    fist_pump integer,
    city character(255),
    state character(2)
);


--
-- TOC entry 174 (class 1259 OID 16782)
-- Name: protests_event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE protests_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2055 (class 0 OID 0)
-- Dependencies: 174
-- Name: protests_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE protests_event_id_seq OWNED BY protest.event_id;


--
-- TOC entry 176 (class 1259 OID 16790)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2056 (class 0 OID 0)
-- Dependencies: 176
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY citizen.id;


--
-- TOC entry 1927 (class 2604 OID 16796)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY citizen ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 1926 (class 2604 OID 16795)
-- Name: event_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY protest ALTER COLUMN event_id SET DEFAULT nextval('protests_event_id_seq'::regclass);


--
-- TOC entry 2049 (class 0 OID 16784)
-- Dependencies: 175
-- Data for Name: citizen; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO citizen (username, email, password, id, avatar, twitter_id, location, twitter_token, twitter_secret, salt) VALUES ('tad', 'tad@example.com', '$2a$10$Gj7OSAs.VkYiwunIFLM/MO.CUgxaLO2Xd0qtYghzwEEvMn/1qdT2m', 1, '', NULL, 'Louisville KY', NULL, NULL, '$2a$10$Gj7OSAs.VkYiwunIFLM/MO');


--
-- TOC entry 2047 (class 0 OID 16776)
-- Dependencies: 173
-- Data for Name: protest; Type: TABLE DATA; Schema: public; Owner: -
--
--
-- TOC entry 2057 (class 0 OID 0)
-- Dependencies: 174
-- Name: protests_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('protests_event_id_seq', 6, true);


--
-- TOC entry 2058 (class 0 OID 0)
-- Dependencies: 176
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('users_id_seq', 21, true);


--
-- TOC entry 1929 (class 2606 OID 16798)
-- Name: protests_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY protest
    ADD CONSTRAINT protests_pkey PRIMARY KEY (event_id);


--
-- TOC entry 1931 (class 2606 OID 24968)
-- Name: unique_email; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY citizen
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- TOC entry 1933 (class 2606 OID 24983)
-- Name: unique_username; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY citizen
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- TOC entry 1935 (class 2606 OID 16800)
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY citizen
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 1936 (class 2606 OID 16808)
-- Name: protests_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY protest
    ADD CONSTRAINT protests_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES citizen(id);


--
-- TOC entry 1937 (class 2606 OID 16813)
-- Name: userfk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY protest
    ADD CONSTRAINT userfk FOREIGN KEY (submitted_by) REFERENCES citizen(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2016-04-17 15:39:36 PDT

--
-- PostgreSQL database dump complete
--
