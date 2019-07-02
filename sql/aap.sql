BEGIN

    declare localPlayerID int;
    declare localQueueID int;
    select id into localPlayerID from users where UUID = in_uuid;


    -- controllo se ero già in coda e qualcuno si è unito
    if exists (select 0 from queue q
                where q.stato = 1 and q.id = ifnull(in_queue, 0) and q.id_match is not null
                limit 1) then

      select q.*
      from queue q
      where q.stato = 1 and q.id = ifnull(in_queue, 0) and q.id_match is not null limit 1;

    -- controllo se c'è già almeno un'altra persona in coda
	elseif exists (select 0 from queue where stato = 0 and player1 != localPlayerID) THEN

    	select id into localQueueID from queue where stato = 0 and player1 != localPlayerID limit 1;

    	update queue
    	set stato = 2,
    	    data_mod = NOW()
    	where player1 = localPlayerID and stato = 0;

        insert into games(player1, player2, data_inizio, data_fine) -- TODO a regime levare data fine !!!!
        select player1, localPlayerID, NOW(), NOW() from queue where id = localQueueID limit 1;

    	update queue
        set stato = 1,
            player2 = localPlayerID,
            data_mod = NOW(),
            id_match = LAST_INSERT_ID()
        where id = localQueueID;

    	select * from queue where id = localQueueID;

    -- se non c'è nessuno in coda ed io non lo ero già mi ci metto
    elseif not exists (select 0 from queue where player2 is null and player1 = localPlayerID) THEN

    	insert into queue(data_ins,data_mod,player1) VALUES(NOW(), NOW(), localPlayerID);

    	select LAST_INSERT_ID() as id;

    else

        select

    end if;

end