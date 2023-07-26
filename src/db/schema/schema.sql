table auth{
    noisekey TEXT,
    signedidentitykey TEXT, 
    signedprekey TEXT, 
    registrationid TEXT, 
    advsecretkey TEXT, 
    nextprekeyid TEXT, 
    firstunuploadedprekeyid TEXT, 
    account TEXT, 
    me TEXT, 
    signalidentities TEXT, 
    lastaccountsynctimestamp TEXT, 
    myappstatekeyid TEXT
}

table bday{
    name TEXT NOT NULL,
    username TEXT NOT NULL, 
    date INTEGER NOT NULL, 
    month INTEGER NOT NULL, 
    year INTEGER, 
    place TEXT NOT NULL, 
    number TEXT PRIMARY KEY
}

table blacklist{
    number TEXT PRIMARY KEY, 
    reason TEXT NOT NULL, 
    admin TEXT NOT NULL
}

table countmember{
    memberjid TEXT NOT NULL, 
    groupjid TEXT NOT NULL, 
    message_count INTEGER NOT NULL DEFAULT 0, 
    warning INTEGER NOT NULL DEFAULT 0, 
    PRIMARY KEY (memberjid, groupjid), 
    CHECK(warning BETWEEN 0 and 3)
}

table countvideo{
    memberjid TEXT NOT NULL, 
    groupjid TEXT NOT NULL, 
    count INTEGER NOT NULL DEFAULT 0, 
    PRIMARY KEY (memberjid, groupjid)
}

table meta{
    variable text PRIMARY KEY,
    value BOOLEAN 
}

table groups{
    groupjid TEXT PRIMARY KEY, 
    gname TEXT NOT NULL, 
    link TEXT, 
    commands_disabled JSON
}

table members{
    memberjid TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    donation INTEGER,
    milestone JSON
}

table milestonetext{
    sno SERIAL, 
    milestone TEXT PRIMARY KEY
}

table news{
    headline TEXT PRIMARY KEY,
    at DATE NOT NULL
}

table voting{
    groupjid TEXT PRIMARY KEY, 
    is_started BOOLEAN NOT NULL, 
    started_by TEXT NOT NULL, 
    title TEXT NOT NULL, 
    choices JSON NOT NULL, 
    count JSON NOT NULL, 
    members_voted_for JSON NOT NULL, 
    voted_members JSON NOT NULL
}

table unknowncmd{
    command TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0,
}