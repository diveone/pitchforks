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
    date timestamp with time zone,
    submitted_by integer,
    event_id integer NOT NULL
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
    avatar character varying(255)
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

COPY protests (name, location, date, submitted_by, event_id) FROM stdin;
Protest SF	Berkely CA	2014-12-20 00:00:00-08	\N	1
\.


--
-- Name: protests_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: proto
--

SELECT pg_catalog.setval('protests_event_id_seq', 1, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: proto
--

COPY users (username, email, password, id, avatar) FROM stdin;
\N	\N	\N	2	\N
\N	\N	\N	3	\N
Mary	mary@mary.me	test	4	\N
Trent	trent@trent.me	test	5	\N
kay	kay@gmail.com	test	1	https://avatars1.githubusercontent.com/u/6880594?v=3&s=460
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: proto
--

SELECT pg_catalog.setval('users_id_seq', 5, true);


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
-- Name: protests_submitted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: proto
--

ALTER TABLE ONLY protests
    ADD CONSTRAINT protests_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES users(id);


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

