table unknowncmd{
    command TEXT PRIMARY KEY,
    count integer NOT NULL DEFAULT 0,
}

table auth{
    noisekey text NOT NULL,
    signedidentitykey text NOT NULL, 
    signedprekey text NOT NULL, 
    registrationid text NOT NULL, 
    advsecretkey text NOT NULL, 
    nextprekeyid text NOT NULL, 
    firstunuploadedprekeyid text NOT NULL, 
    account text NOT NULL, 
    me text NOT NULL, 
    signalidentities text NOT NULL, 
    lastaccountsynctimestamp text NOT NULL, 
    myappstatekeyid text NOT NULL,
}

table bday{
    name text NOT NULL,
    username text NOT NULL, 
    date integer NOT NULL, 
    month integer NOT NULL, 
    year integer, 
    place text NOT NULL, 
    number text PRIMARY KEY,
}

table blacklist{
    number text PRIMARY KEY, 
    reason text NOT NULL, 
    admin text NOT NULL,
}

table countmember{
    memberjid text NOT NULL, 
    groupjid text NOT NULL, 
    message_count integer NOT NULL DEFAULT 0, 
    warning integer NOT NULL DEFAULT 0, 
    PRIMARY KEY (memberjid, groupjid), 
    check(warning BETWEEN 0 and 3),
}

table countvideo{
    memberjid text NOT NULL, 
    groupjid text NOT NULL, 
    count integer NOT NULL DEFAULT 0, 
    PRIMARY KEY (memberjid, groupjid),
}

table grouplinksenabled{
    enabled integer PRIMARY KEY,
}

table groups{
    groupjid text PRIMARY KEY, 
    gname text NOT NULL, 
    link text, 
    commands_disabled json,
}

table members{
    memberjid text PRIMARY KEY, 
    name text NOT NULL,
    donation integer,
}

table milestone{
    memberjid text PRIMARY KEY, 
    achieved json,
}

table milestonetext{
    sno SERIAL PRIMARY KEY, 
    milestone text,
}

table studynews{
    news text PRIMARY KEY,
}

table technews{
    news text PRIMARY KEY,
}

table voting{
    groupjid text PRIMARY KEY, 
    is_started Boolean NOT NULL, 
    started_by text NOT NULL, 
    title text NOT NULL, 
    choices json NOT NULL, 
    count json NOT NULL, 
    members_voted_for json NOT NULL, 
    voted_members json NOT NULL,
}