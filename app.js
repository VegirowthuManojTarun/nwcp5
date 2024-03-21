const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'moviesData.db')
let db = null

app.use(express.json())

const initDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Error: ${e.message}`)
    process.exit(1)
  }
}

initDBAndServer()

//api1
app.get('/movies/', async (request, response) => {
  const getAllPlayersQuery = `SELECT * FROM movie;`
  const players = await db.all(getAllPlayersQuery)

  const ans = players => {
    return {
      "movieName": players.movie_name,
    }
  }
  response.send(players.map(eachPlayer => ans(eachPlayer)))
  // return players
})

//api2
app.post('/movies/', async (request, response) => {
  const playerInfo = request.body
  const {directorId, movieName, leadActor} = playerInfo
  const postPlayerQuery = `
  INSERT INTO movie(director_id,movie_name,lead_actor)
  VALUES(${directorId},'${movieName}','${leadActor}')
  ;`
  await db.get(postPlayerQuery)
  response.send('Movie Successfully Added')
  // return 'Player Added to Team'
})

//api3
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getPlayerQuery = `
  SELECT *
  FROM movie
  WHERE movie_id = ${movieId};`
  const particularPlayer = await db.get(getPlayerQuery)

  response.send({
    movieId: particularPlayer.movie_id,
    directorId: particularPlayer.director_id,
    movieName: particularPlayer.movie_name,
    leadActor: particularPlayer.lead_actor,
  })
  // return particularPlayer
})

//api4
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const playerInfo = request.body
  const {directorId, movieName, leadActor} = playerInfo

  const updatePlayerQuery = `
  UPDATE movie
  SET 
  director_id = ${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  WHERE movie_id = ${movieId}
  ;`
  await db.run(updatePlayerQuery)
  response.send('Movie Details Updated')
  // return 'Player Details Updated'
})

//api5
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deletePlayerQuery = `
  DELETE 
  FROM movie
  WHERE movie_id = ${movieId};`
  await db.run(deletePlayerQuery)
  response.send('Movie Removed')
  // return 'Player Removed'
})

//api6
app.get('/directors/', async (request, response) => {
  const getAllPlayersQuery = `SELECT * FROM director;`
  const players = await db.all(getAllPlayersQuery)

  const ans = players => {
    return {
      directorId: players.director_id,
      directorName: players.director_name,
    }
  }
  response.send(players.map(eachPlayer => ans(eachPlayer)))
  // return players
})

//api7
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getAllPlayersQuery = `SELECT *
    FROM movie
    WHERE director_id = ${directorId};`
  const players = await db.all(getAllPlayersQuery)

  const ans = players => {
    return {
      movieName: players.movie_name,
    }
  }
  response.send(players.map(eachPlayer => ans(eachPlayer)))
  // return players
})
module.exports = app
