// module to support REST APIs developement.
const express = require('express');

// module to support JSON files parsing and formate confirmation. Used in the POST  request.
const Joi = require('joi');

const app = express();

// MySQL driver to access the database
const mysql = require('mysql');
const {host, user, password, db } = require('./config/db');
var con = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: db
})

process.title = "Crosswalk Service"

con.connect((err) => {
    if (err) throw err;
    console.log("MySQL connection estabilished at " + host + "/" + db);
})

const bodyParser = require('body-parser')

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json())

app.get('/crosswalks', (req, res) => {
    console.log("GET crosswalks ");
	con.query("SELECT * FROM crosswalks", [], (err, results) => {
        if(err)
        {
            return res.status(400).send({"success": false, "error": err.message});
        }
        return res.status(200).send(results)
    })
});

// Nearby Vehicles
app.get('/crosswalk/:id/nearby_vehicles', (req, res) => {
    console.log("GET crosswalk nearby vehicles " + req.params.id);
	const crosswalk_id = req.params.id;
	con.query("SELECT vehicle_id FROM nearby_vehicles WHERE crosswalk_id = ?", [crosswalk_id], (err, results) => {
        if(err)
        {
            return res.status(400).send({"success": false, "error": err.message});
        }
        return res.status(200).send({"success": true, "crosswalk": crosswalk_id, "vehicles": results})
    })
});

app.post('/crosswalk/:id/nearby_vehicle', (req, res) => {
    console.log("POST crosswalk set nearby vehicle ");
    const crosswalk_id = req.params.id;
    const vehicle_id = req.body.vehicle_id;
    console.log("Crosswalk: " + crosswalk_id + " Vehicle: " + vehicle_id);
	con.query("INSERT IGNORE INTO nearby_vehicles(crosswalk_id, vehicle_id) VALUES(?,?)", [crosswalk_id, vehicle_id], (err, results) => {
        if(err)
        {
            console.log("Error posting crosswalk nearby vehicle:")
            console.log(err.message);
            return res.status(400).send({"success": false, "error": err.message});
        }
        return res.status(200).send({"success": true})
    })
});

app.delete('/crosswalk/:crosswalk_id/nearby_vehicle/:vehicle_id', (req, res) => {
    console.log("DELETE crosswalk set nearby vehicle ");
    const crosswalk_id = req.params.crosswalk_id;
    const vehicle_id = req.params.vehicle_id;
    console.log("Crosswalk: " + crosswalk_id + " Vehicle: " + vehicle_id);
	con.query("DELETE FROM nearby_vehicles WHERE crosswalk_id = ? AND vehicle_id = ?", [crosswalk_id, vehicle_id], (err, results) => {
        if(err)
        {
            console.log("Error deleting crosswalk nearby vehicle:")
            console.log(err.message);
            return res.status(400).send({"success": false, "error": err.message});
        }
        return res.status(200).send({"success": true})
    })
});

// Nearby Pedestrians
app.get('/crosswalk/:id/nearby_pedestrians', (req, res) => {
    console.log("GET crosswalk nearby pedestrians");
    const crosswalk_id = req.params.id;
    console.log("Crosswalk: " + crosswalk_id);
	con.query("SELECT pedestrian_id FROM nearby_pedestrians WHERE crosswalk_id = ?", [crosswalk_id], (err, results) => {
        if(err)
        {
            return res.status(400).send({"success": false, "error": err.message});
        }
        return res.status(200).send({"success": true, "crosswalk": crosswalk_id, "pedestrians": results});
    })
});

app.post('/crosswalk/:id/nearby_pedestrian', (req, res) => {
    console.log("POST crosswalk set nearby pedestrian ");
    const crosswalk_id = req.params.id;
    const pedestrian_id = req.body.pedestrian_id;
    console.log("Crosswalk: " + crosswalk_id + " Pedestrian: " + pedestrian_id);
	con.query("INSERT IGNORE INTO nearby_pedestrians(crosswalk_id, pedestrian_id) VALUES(?,?)", [crosswalk_id, pedestrian_id], (err, results) => {
        if(err)
        {
            return res.status(400).send({"success": false, "error": err.message});
        }
        return res.status(200).send({"success": true})
    })
});

app.delete('/crosswalk/:crosswalk_id/nearby_pedestrian/:pedestrian_id', (req, res) => {
    console.log("DELETE crosswalk set nearby pedestrian ");
    const crosswalk_id = req.params.crosswalk_id;
    const pedestrian_id = req.params.pedestrian_id;
    console.log("Crosswalk: " + crosswalk_id + " Pedestrian: " + pedestrian_id);
	con.query("DELETE FROM nearby_pedestrians WHERE crosswalk_id = ? AND pedestrian_id = ?", [crosswalk_id, pedestrian_id], (err, results) => {
        if(err)
        {
            return res.status(400).send({"success": false, "error": err.message});
        }
        return res.status(200).send({"success": true})
    })
});

app.get('/crosswalk/:id', (req, res) => {
    console.log("GET crosswalk " + req.params.id);
	const crosswalk_id = req.params.id;
	con.query("SELECT * FROM crosswalks WHERE id = ?", [crosswalk_id], (err, results) => {
        if(err)
        {
            return res.status(400).send(err.message);
        }
        return res.status(200).send(results[0])
    })
});


app.post('/crosswalk/', (req, res) => {
    console.log("POST crosswalk, body: ");
    console.dir(req.body);
    const body = req.body;
    const result = validateCreateInput(body);
    if(result.error)
    {
        return res.status(400).send(result.error.details[0].message);
    }

    const params = [body.state, body.latitude, body.longitude];
	con.query("INSERT INTO crosswalks(state, latitude, longitude) VALUES (?, ?, ?)", params, (err, results) => {
        if(err)
        {
            return res.status(400).send(err.message);
        }

        return res.status(200).send({"success": true, "id": results.insertId});
    })

})

app.put('/crosswalk/:id', (req, res) => {
    console.log("PUT crosswalk, body: ");
    console.dir(req.body);
    var body = req.body;
    const result = validateUpdateInput(body);
    if(result.error)
    {
        return res.status(400).send(result.error.details[0].message);
    }
    const params = [body.state, body.id];
	con.query("UPDATE crosswalks SET state = ? WHERE id = ?", params, (err, results) => {
        if(err)
        {
            console.log("Error updating a crosswalk");
            console.log(err.message);
            return res.status(400).send(err.message);
        }

        return res.status(200).send({"success": results.affectedRows == 1});
    })
})

// Setting PORT to listen to incoming requests or by default use port 3000
// Take not that the string in the argument of log is a "back tick" to embedded variable.

const port = process.env.PORT || 3004;

app.listen(port, (req, res) => { 
    console.log(`Listen on port ...${port}`);
});

// function to valide create input parameters 
function validateCreateInput(input){
    const schema = {
        state: Joi.string().min(2).max(3).required(),
        latitude: Joi.number().precision(8).required(),
        longitude: Joi.number().precision(8).required(),
    };
    return Joi.validate(input, schema);
}


// function to valide update input parameters 
function validateUpdateInput(input){
    const schema = {
        id: Joi.number().min(1).max(8).required(),
        state: Joi.string().min(2).max(3).required(),
    };
    return Joi.validate(input, schema);
}