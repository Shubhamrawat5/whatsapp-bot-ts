table auth {
    uuid UUID,
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
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
}

table bday {
    uuid UUID,
    memberjid TEXT PRIMARY KEY
    name TEXT NOT NULL,
    username TEXT NOT NULL, 
    date INTEGER NOT NULL, 
    month INTEGER NOT NULL, 
    year INTEGER, 
    place TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT bday_memberjid_fkey FOREIGN KEY(memberjid) REFERENCES members(memberjid)
}

table blacklist {
    uuid UUID,
    memberjid TEXT PRIMARY KEY, 
    reason TEXT NOT NULL, 
    admin TEXT NOT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT blacklist_memberjid_fkey FOREIGN KEY(memberjid) REFERENCES members(memberjid)
}

table countmember {
    uuid UUID,
    memberjid TEXT NOT NULL, 
    groupjid TEXT NOT NULL, 
    message_count INTEGER NOT NULL DEFAULT 0, 
    warning_count INTEGER NOT NULL DEFAULT 0, 
    video_count INTEGER NOT NULL DEFAULT 0, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (memberjid, groupjid), 
    CHECK(warning BETWEEN 0 and 3),

    CONSTRAINT countmember_groupjid_fkey FOREIGN KEY (groupjid) REFERENCES groups (groupjid),
    CONSTRAINT countmember_memberjid_fkey FOREIGN KEY (memberjid) REFERENCES members (memberjid)
}

table meta {
    uuid UUID,
    variable text PRIMARY KEY,
    value boolean NOT NULL,
    last_updated Date NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
}

table groups {
    uuid UUID,
    groupjid TEXT PRIMARY KEY, 
    gname TEXT NOT NULL, 
    link TEXT, 
    commands_disabled TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
}

table members {
    uuid UUID,
    memberjid TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    donation INTEGER NOT NULL DEFAULT 0,
    milestone TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
}

table milestonetext {
    uuid UUID,
    sno SERIAL NOT NULL, 
    milestone TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
}

table news {
    uuid UUID,
    headline TEXT PRIMARY KEY,
    at DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
}

table voting {
    uuid UUID,
    groupjid TEXT PRIMARY KEY, 
    is_started BOOLEAN NOT NULL, 
    started_by TEXT NOT NULL, 
    title TEXT NOT NULL, 
    choices TEXT[] NOT NULL, 
    count TEXT[] NOT NULL, 
    members_voted_for TEXT[][] NOT NULL, 
    voted_members TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
}

table unknowncmd {
    uuid UUID,
    command TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
}