BEGIN

    declare localPlayerID int;
    declare localQueueID int;
    select id into localPlayerID from users where UUID = in_uuid;

    start transaction;

    /*DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            select 'Error during the start of queue !' as error;
            ROLLBACK;
        END;*/

    -- controllo se ero già in coda e qualcuno si è unito
    if exists (select 0 from queue q
                where q.stato = 1 and q.id = ifnull(in_queue, 0) and q.id_match is not null
                limit 1) then

      select q.*
      from queue q
      where q.stato = 1 and q.id = ifnull(in_queue, 0) and q.id_match is not null
      limit 1;

    -- controllo se c'è già almeno un'altra persona in coda
	elseif exists (select 0 from queue where stato = 0 and player1 != localPlayerID) THEN

    	select id into localQueueID from queue where stato = 0 and player1 != localPlayerID limit 1;

    	update queue
    	set stato = 2,
    	    data_mod = NOW()
    	where player1 = localPlayerID and stato = 0;

        insert into games(player1, player2, data_inizio) -- TODO a regime levare data fine !!!!
        select player1, localPlayerID, NOW() from queue where id = localQueueID limit 1;

    	update queue
        set stato = 1,
            player2 = localPlayerID,
            data_mod = NOW(),
            id_match = LAST_INSERT_ID()
        where id = localQueueID;

    	select * from queue where id = localQueueID;

    -- se sono già in coda ma non avevo l'id sul client
    elseif exists (select 0 from queue where player2 is null and player1 = localPlayerID) THEN

       select id from queue where player2 is null and player1 = localPlayerID;

    -- se non c'è nessuno in coda ed io non lo ero già mi ci metto
    elseif not exists (select 0 from queue where player2 is null and player1 = localPlayerID) THEN

    	insert into queue(data_ins,data_mod,player1) VALUES(NOW(), NOW(), localPlayerID);
    	select LAST_INSERT_ID() as id;

    end if;

    commit;

end



-----------------------------------------------------------------------------------------------------

begin
-- in_id_match
    declare localPlayerID int;
    select id into localPlayerID from users where UUID = in_uuid;

    -- controllo che il match sia coerente con l'utente che fa la chiamata
    if exists (select 0 from games where id = in_id_match  and (player1 = localPlayerID or player2 = localPlayerID)) then
        if exists (select 0 from games where id = in_id_match  and player1 = localPlayerID) then
            select player2 as uuid, score2 as points from games where id = in_id_match;
        else
            select player1 as uuid, score1 as points from games where id = in_id_match;
        end if;
    else
        select 'Match not found !';
    end if;

end


