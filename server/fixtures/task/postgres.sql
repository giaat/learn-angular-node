INSERT INTO
  public."Task"(id, "title", "content", "createdAt", "updatedAt")
VALUES
  (1, 'My little task', 'I must wash my clothes before going to bed!', '2017-06-08T00:00:00.000Z', '2017-06-08T00:00:00.000Z'),
  (2, 'TODO', 'Clean the house, buy pizza, buy beer', '2017-06-08T00:00:00.000Z', '2017-06-08T00:00:00.000Z');

SELECT setval('"Task_id_seq"', COALESCE((SELECT MAX(id)+1 FROM "Task"), 1), false);
