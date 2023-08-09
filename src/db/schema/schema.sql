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
    number TEXT PRIMARY KEY
    name TEXT NOT NULL,
    username TEXT NOT NULL, 
    date INTEGER NOT NULL, 
    month INTEGER NOT NULL, 
    year INTEGER, 
    place TEXT NOT NULL, 
}

table blacklist{
    memberjid TEXT PRIMARY KEY, 
    reason TEXT NOT NULL, 
    admin TEXT NOT ,
    CONSTRAINT blacklist_memberjid_fkey FOREIGN KEY(memberjid) REFERENCES members(memberjid)
}

table countmember{
    memberjid TEXT NOT NULL, 
    groupjid TEXT NOT NULL, 
    message_count INTEGER NOT NULL DEFAULT 0, 
    warning_count INTEGER NOT NULL DEFAULT 0, 
    video_count INTEGER NOT NULL DEFAULT 0, 
    PRIMARY KEY (memberjid, groupjid), 
    CHECK(warning BETWEEN 0 and 3),

    CONSTRAINT countmember_groupjid_fkey FOREIGN KEY (groupjid) REFERENCES groups (groupjid),
    CONSTRAINT countmember_memberjid_fkey FOREIGN KEY (memberjid) REFERENCES members (memberjid)
}

table meta{
    variable text PRIMARY KEY,
    value boolean NOT NULL,
    last_updated Date NOT NULL
}

table groups{
    groupjid TEXT PRIMARY KEY, 
    gname TEXT NOT NULL, 
    link TEXT, 
    commands_disabled TEXT[] NOT NULL
}

table members{
    memberjid TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    donation INTEGER NOT NULL DEFAULT 0,
    milestone TEXT[] NOT NULL
}

table milestonetext{
    sno SERIAL NOT NULL, 
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
    choices TEXT[] NOT NULL, 
    count TEXT[] NOT NULL, 
    members_voted_for TEXT[][] NOT NULL, 
    voted_members TEXT[] NOT NULL
}

table unknowncmd{
    command TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0,
}