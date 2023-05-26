/*==============================================================*/
/* Table: INGREDIENT                                            */
/*==============================================================*/

CREATE TABLE IF NOT EXISTS cookbook.ingredients
(
    iid         INT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    picture     VARCHAR(255),

    constraint pk_ingredient PRIMARY KEY (iid)
);

/*==============================================================*/
/* Table: RECIPE                                                */
/*==============================================================*/

CREATE TABLE IF NOT EXISTS cookbook.recipes
(

    rid         INT(11)      NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    steps       LONGTEXT,
    picture     VARCHAR(255),
    rating      INT(11) DEFAULT 0,
    kcal        INT(11),

    constraint pk_ingredient PRIMARY KEY (rid)
);

/*==============================================================*/
/* Table: RECIPE_CONTAINS_INGREDIENT                            */
/*==============================================================*/

CREATE TABLE IF NOT EXISTS cookbook.recipe_contains_ingredient
(
    rid    INT(11) NOT NULL,
    iid    INT(11) NOT NULL,
    amount INT(11),
    unit   VARCHAR(5),
    FOREIGN KEY (rid) REFERENCES recipes (rid) ON DELETE CASCADE,
    FOREIGN KEY (iid) REFERENCES ingredients (iid) ON DELETE CASCADE,
    PRIMARY KEY (rid, iid)
);