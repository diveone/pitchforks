--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: protests; Type: TABLE; Schema: public; Owner: proto; Tablespace: 
--

CREATE TABLE protests (
    name character varying(255),
    location character varying(255),
    date date,
    submitted_by integer,
    event_id integer NOT NULL,
    description text
);


ALTER TABLE public.protests OWNER TO proto;

--
-- Name: protests_event_id_seq; Type: SEQUENCE; Schema: public; Owner: proto
--

CREATE SEQUENCE protests_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.protests_event_id_seq OWNER TO proto;

--
-- Name: protests_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: proto
--

ALTER SEQUENCE protests_event_id_seq OWNED BY protests.event_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: proto; Tablespace: 
--

CREATE TABLE users (
    username character varying(255),
    email character varying(255),
    password character varying(25),
    id integer NOT NULL,
    avatar character varying(255),
    twitter_id character varying(255)
);


ALTER TABLE public.users OWNER TO proto;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: proto
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO proto;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: proto
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: users_protests; Type: TABLE; Schema: public; Owner: proto; Tablespace: 
--

CREATE TABLE users_protests (
    id integer NOT NULL,
    event_id integer NOT NULL
);


ALTER TABLE public.users_protests OWNER TO proto;

--
-- Name: event_id; Type: DEFAULT; Schema: public; Owner: proto
--

ALTER TABLE ONLY protests ALTER COLUMN event_id SET DEFAULT nextval('protests_event_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: proto
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: protests; Type: TABLE DATA; Schema: public; Owner: proto
--

COPY protests (name, location, date, submitted_by, event_id, description) FROM stdin;
Millions March	Oakland CA	2015-01-05	4	3	Today we will be marching 25 miles in the snow\nto prove our point. Join us!
Occupy NYC	New York NY	2014-12-31	1	4	Today we will be marching 25 miles in the snow\nto prove our point. Join us!
Ferguson Protest	Ferguson MO	2015-01-12	1	5	Today we will be marching 25 miles in the snow\nto prove our point. Join us!
Protest SF	Berkely CA	2014-12-20	3	1	Today we will be marching 25 miles in the snow\nto prove our point. Join us!
Occupy Oakland	Chicago IL	2015-02-14	2	2	There will be all day protests down at Berkeley against police.
Occupy Refrigerator	San Francisco CA	2014-12-24	1	6	Anyone hungry?\r\n
Better Minimum Wage	Seattle WA	2014-12-29	1	7	Our wages are too low. Lets organize and let the powers that be know that they need to do better.
\.


--
-- Name: protests_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: proto
--

SELECT pg_catalog.setval('protests_event_id_seq', 7, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: proto
--

COPY users (username, email, password, id, avatar, twitter_id) FROM stdin;
kay	kay@gmail.com	test	1	https://avatars1.githubusercontent.com/u/6880594?v=3&s=460	\N
Robert Mays	rob@rob.me	test	2	/j03.png	\N
Kennedy	ken@ken.me	test	3	fd03.png	\N
Trent	trent@trent.me	test	5	g01.png	\N
Mary	mary@mary.me	test	4	fd02.png	\N
Corey Masters	corey@corey.me	test	6	\N	\N
prototypicalk	test@test.me	test	7	\N	2899801748
prototypicalk	\N	test	8	\N	2899801748
prototypicalk	\N	test	9	\N	2899801748
prototypicalk	\N	test	10	\N	2899801748
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: proto
--

SELECT pg_catalog.setval('users_id_seq', 10, true);


--
-- Data for Name: users_protests; Type: TABLE DATA; Schema: public; Owner: proto
--

COPY users_protests (id, event_id) FROM stdin;
\.


--
-- Name: protests_pkey; Type: CONSTRAINT; Schema: public; Owner: proto; Tablespace: 
--

ALTER TABLE ONLY protests
    ADD CONSTRAINT protests_pkey PRIMARY KEY (event_id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: proto; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_protests_pk; Type: CONSTRAINT; Schema: public; Owner: proto; Tablespace: 
--

ALTER TABLE ONLY users_protests
    ADD CONSTRAINT users_protests_pk PRIMARY KEY (id, event_id);


--
-- Name: protestfk; Type: FK CONSTRAINT; Schema: public; Owner: proto
--

ALTER TABLE ONLY users_protests
    ADD CONSTRAINT protestfk FOREIGN KEY (event_id) REFERENCES protests(event_id);


--
-- Name: protests_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: proto
--

ALTER TABLE ONLY protests
    ADD CONSTRAINT protests_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES users(id);


--
-- Name: userfk; Type: FK CONSTRAINT; Schema: public; Owner: proto
--

ALTER TABLE ONLY protests
    ADD CONSTRAINT userfk FOREIGN KEY (submitted_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_protests_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: proto
--

ALTER TABLE ONLY users_protests
    ADD CONSTRAINT users_protests_event_id_fkey FOREIGN KEY (event_id) REFERENCES protests(event_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_protests_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: proto
--

ALTER TABLE ONLY users_protests
    ADD CONSTRAINT users_protests_id_fkey FOREIGN KEY (id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

