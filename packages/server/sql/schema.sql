CREATE TABLE user_details (
    id bigserial PRIMARY KEY,
    username varchar(50) NULL,
    email varchar(255) UNIQUE NOT NULL
);

CREATE TABLE auth_provider (
    id smallserial PRIMARY KEY,
    code varchar(50) UNIQUE NOT NULL,
    name varchar(50) NOT NULL
);

/*
Invarants:
- for locally registered authentication
  provider_account_identifier is local:<user_id>.
*/
CREATE TABLE authentication (
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES user_details(id),
    provider_id smallint NOT NULL REFERENCES auth_provider(id),
    provider_account_identifier varchar(255) NOT NULL,
    UNIQUE (provider_id, provider_account_identifier)
);

/*
Invariants:
- authentication_id can reference rows with local authentication only.
*/
CREATE TABLE credentials (
    id bigserial PRIMARY KEY,
    authentication_id bigint UNIQUE NOT NULL REFERENCES authentication(id),
    password_hash varchar(255) NOT NULL
);
