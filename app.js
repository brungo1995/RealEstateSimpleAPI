// @ts-check
const express = require('express')
const app = express()
let cors = require("cors");
let bodyParser = require("body-parser");
const connect = require('./db/configDb')
app.use(cors())
app.use(bodyParser.json());


let query1 = `select  house_number, 
street_name,	
sub.description suburb,
postal_code,
      ci.description city,
postal_code,
price
from real_state_db.address as ad
join real_state_db.property as prop
on ad.address_code = prop.address_code 

join real_state_db.suburb as sub
on sub.suburb_code = ad.suburb_code 

join real_state_db.city as ci
on ci.city_code = sub.city_code 

where prop.price BETWEEN 1200000 and 2250000 
and prop.is_available = 1
and ci.city_code = 'CPT'
`;

let query2 = `select  house_number, 
street_name,	
sub.description suburb,
postal_code,
             ci.description city,
postal_code,
prop.bed as beds,
prop.swimming_pool as swimming_pool,
Price
from real_state_db.address as ad
join real_state_db.property as prop
on ad.address_code = prop.address_code 

join real_state_db.suburb as sub
on sub.suburb_code = ad.suburb_code 

join real_state_db.city as ci
on ci.city_code = sub.city_code 

where prop.is_available = 1
and ci.city_code = 'CPT'
and sub.description = 'Parklands'
and prop.bed >= 4
and prop.swimming_pool = 0
`;

let query3 = `select  distinct
ag.name,
      ag.surname,

SUM(prop.price) over (partition by sold.agent_code) as total_max_sale       
from real_state_db.sold_property as sold
join real_state_db.property as prop

on prop.property_code = sold.property_code
join real_state_db.agent as ag
on ag.agent_code = prop.agent_code 
where year(sold.sell_date) = 2018
order by total_max_sale desc limit 1
`;

let query4 = `select  distinct
ag.name,
      ag.surname,
avg(prop.price) over (partition by sold.agent_code) as average_sale_for_all_houses,
DATEDIFF(sold.sell_date, prop.list_date) as days_avg_for_each_sell
from real_state_db.sold_property as sold
join real_state_db.property as prop

on prop.property_code = sold.property_code
join real_state_db.agent as ag
on ag.agent_code = prop.agent_code 
where year(sold.sell_date) = 2018

`;

let query5 = `select  
prop.description,
prop.price,
prop.picture    
from real_state_db.property as prop
order by prop.price desc limit 3
`;

let query6 = `INSERT INTO real_state_db.sold_property
(buyer_code, property_code, buyer_agent_code, sell_date, agent_code)
VALUES ('1', '28', '1', '2018-09-08', '3');`

let query7 = `UPDATE real_state_db.property 
    SET real_state_db.property.is_available = 0
  WHERE real_state_db.property.property_code = 28;
  ;
`

let query8 = `INSERT INTO real_state_db.agent ( name, surname) VALUES ( 'Edvaldo ', 'Domingos');`


let getAllHousesQuery = `select  house_number, 
street_name,	
sub.description suburb,
postal_code,
ci.description city,
postal_code,
prop.bed as beds,
prop.swimming_pool as swimming_pool,
price,
prop.description,
prop.property_code,

prop.list_date,
prop.picture,
prop.address_code,
ad.suburb_code,
sub.city_code,
prop.agent_code,
ag.name as agent_name,
ag.surname as agent_surname,
sel.name as seller_name,
sel.surname as seller_suname,
sel.seller_code 

from real_state_db.address as ad
join real_state_db.property as prop
on ad.address_code = prop.address_code 

join real_state_db.suburb as sub
on sub.suburb_code = ad.suburb_code 

join real_state_db.city as ci
on ci.city_code = sub.city_code 

join real_state_db.agent as ag
on  ag.agent_code = prop.agent_code

join real_state_db.seller as sel
on  sel.seller_code = prop.seller_code

where prop.is_available = 1

`;
app.get('/property/getAll', function (req, res) {
    connect.query(getAllHousesQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})



let ex = `select  house_number, 
street_name,	
sub.description suburb,
postal_code,
ci.description city,
postal_code,
prop.bed as beds,
prop.swimming_pool as swimming_pool,
price,
prop.description,
prop.property_code,

prop.list_date,
prop.picture,
prop.address_code,
ad.suburb_code,
sub.city_code,
prop.agent_code,
ag.name as agent_name,
ag.surname as agent_surname,
sel.name as seller_name,
sel.surname as seller_suname,
sel.seller_code 



from real_state_db.address as ad
join real_state_db.property as prop
on ad.address_code = prop.address_code 

join real_state_db.suburb as sub
on sub.suburb_code = ad.suburb_code 

join real_state_db.city as ci
on ci.city_code = sub.city_code 

join real_state_db.agent as ag
on  ag.agent_code = prop.agent_code

join real_state_db.seller as sel
on  sel.seller_code = prop.seller_code

where prop.price BETWEEN 1200000 and 2250000 
and prop.is_available = 1
and ci.city_code = 'CPT'
`
app.post("/property/getSearh", function (req, res) {
    let searchQuery = `
    select  house_number, 
street_name,	
sub.description suburb,
postal_code,
ci.description city,
postal_code,
prop.bed as beds,
prop.swimming_pool as swimming_pool,
price,
prop.description,
prop.property_code,

prop.list_date,
prop.picture,
prop.address_code,
ad.suburb_code,
sub.city_code,
prop.agent_code,
ag.name as agent_name,
ag.surname as agent_surname,
sel.name as seller_name,
sel.surname as seller_suname,
sel.seller_code 

from real_state_db.address as ad
join real_state_db.property as prop
on ad.address_code = prop.address_code 

join real_state_db.suburb as sub
on sub.suburb_code = ad.suburb_code 

join real_state_db.city as ci
on ci.city_code = sub.city_code 

join real_state_db.agent as ag
on  ag.agent_code = prop.agent_code

join real_state_db.seller as sel
on  sel.seller_code = prop.seller_code
where prop.is_available = 1 `;
    let min = req.body.min ? req.body.min : '';
    let max = req.body.max ? req.body.max : '';
    if (min != '' && max != '') {
        searchQuery += ` and price BETWEEN ${min} and ${max}`
    } else if (min != '' && max === '') {
        searchQuery += ` and price >= ${min}`
    } else if (max != '' && min === '') {
        searchQuery += `and price <= ${max}`
    } else {
        searchQuery += ` `
    }


    let city = req.body.city ? req.body.city : '';
    if (city != '') {
        searchQuery += ` and sub.city_code = '${city}'`
    }

    let suburb = req.body.suburb ? req.body.suburb : '';
    if (suburb != '') {
        searchQuery += ` and sub.suburb_code = ${suburb}`;
    }

    let beds = req.body.beds ? req.body.beds : '';
    if (beds != '') {
        searchQuery += ` and bed = ${beds} `;
    }

    let swimming_pool = req.body.swimming_pool ? req.body.swimming_pool : '';
    if (swimming_pool != '') {
        if (swimming_pool === 1) {
            searchQuery += ` and swimming_pool = ${swimming_pool}`
        }
        if (swimming_pool === 2) {
            searchQuery += ` and swimming_pool = ${0}`

        }
    }

    let mostExpensive = req.body.mostExpensive ? req.body.mostExpensive : ''
    if (mostExpensive != '') {
        searchQuery += `  order by price desc limit 3`
    }
    console.log(req.body)
    connect.query(searchQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })

})

app.get('/agent/getAll', function (req, res) {
    let query = "SELECT * FROM real_state_db.agent;";
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})

app.post('/agent/create', function (req, res) {
    let { name, surname } = req.body
    let insertQuery = `INSERT INTO real_state_db.agent (name, surname) VALUES ('${name}', '${surname}');`;
    connect.query(insertQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
    })

    let getLastQuery = `SELECT * FROM real_state_db.agent ORDER BY agent_code DESC LIMIT 1`
    connect.query(getLastQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })

})

app.post("/agent/mostExpensiveByDate", function (req, res) {
    let { date } = req.body
    let query =
        `   select  distinct
	    ag.name,
        ag.surname,

        SUM(prop.price) over (partition by sold.agent_code) as total_max_sale       
        from real_state_db.sold_property as sold
        join real_state_db.property as prop

        on prop.property_code = sold.property_code
        join real_state_db.agent as ag
        on ag.agent_code = prop.agent_code 
        where year(sold.sell_date) = ${date}
        order by total_max_sale desc limit 1
`;
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})

app.post("/agent/averageByDate", function (req, res) {
    let { date } = req.body
    let query =
        `   
        select  distinct
        ag.name,
        ag.surname,
     avg(prop.price) over (partition by sold.agent_code) as average_sale_for_all_houses,
    DATEDIFF(sold.sell_date, prop.list_date) as days_avg_for_each_sell
    from real_state_db.sold_property as sold
    join real_state_db.property as prop
    
    on prop.property_code = sold.property_code
    join real_state_db.agent as ag
    on ag.agent_code = prop.agent_code 
    where year(sold.sell_date) = ${date}
    
`;
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})

app.get('/buyerAgent/getAll', function (req, res) {
    let query = "SELECT * FROM real_state_db.buyer_agent;";
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})

app.post('/buyerAgent/create', function (req, res) {
    let { name, surname, buyer_code } = req.body
    let insertQuery = `INSERT INTO real_state_db.buyer_agent (buyer_code, name, surname) VALUES (${buyer_code}, '${name}', '${surname}');`;
    connect.query(insertQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
    })

    let getLastQuery = `SELECT * FROM real_state_db.buyer_agent ORDER BY buyer_agent_code DESC LIMIT 1`
    connect.query(getLastQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })

})


app.get('/buyer/getAll', function (req, res) {
    let query = "SELECT * FROM real_state_db.buyer;";
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})

app.post('/buyer/create', function (req, res) {
    let dpReplies = {}
    let { name, surname } = req.body
    let insertQuery = `INSERT INTO real_state_db.buyer (name, surname) VALUES ('${name}', '${surname}');`;
    connect.query(insertQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
    })

    let getLastBuyerQuery = `SELECT * FROM real_state_db.buyer ORDER BY buyer_code DESC LIMIT 1`
    connect.query(getLastBuyerQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })

})


app.get('/seller/getAll', function (req, res) {
    let query = "SELECT * FROM real_state_db.seller;";
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})

app.get('/soldProperty/getAll', function (req, res) {
    let query = "SELECT * FROM real_state_db.sold_property;";
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})


app.post('/soldProperty/create', function (req, res) {
    let { buyer_code, property_code, buyer_agent_code, sell_date, agent_code } = req.body
    let insertQuery = `INSERT INTO real_state_db.sold_property
    (buyer_code, property_code, buyer_agent_code, sell_date, agent_code)
    VALUES (${buyer_code}, ${property_code}, ${buyer_agent_code ? buyer_agent_code : 0}, '${sell_date}', ${agent_code});`



    connect.query(insertQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
    })

    let getLastBuyerQuery = `UPDATE real_state_db.property 
    SET real_state_db.property.is_available = 0
    WHERE real_state_db.property.property_code = ${property_code}`
    connect.query(getLastBuyerQuery, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })

})


app.get('/city/getAll', function (req, res) {
    let query = "SELECT * FROM real_state_db.city;";
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})


app.get('/suburb/getAll', function (req, res) {
    let query = "SELECT * FROM real_state_db.suburb;";
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})


app.get('/address/getAll', function (req, res) {
    let query = "SELECT * FROM real_state_db.address;";
    connect.query(query, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        res.status(200).json(result)
    })
})



app.get('/query3', function (req, res) {
    connect.query(query3, function (err, result) {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).json(result).send()
    })
})


app.get('/query4', function (req, res) {
    connect.query(query4, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).send(err)
        }
        res.status(200).json(result).send()
    })
})

app.get('/query5', function (req, res) {
    connect.query(query5, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).send(err)
        }
        res.status(200).json(result).send()
    })
})

app.get('/query6', function (req, res) {
    let resultColl = {}
    connect.query(query6, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).send(err)
        }
        resultColl.res1 = result
    })

    connect.query(query7, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).send(err)
        }
        resultColl.res2 = result
        res.status(200).json(resultColl).send()
    })

})

app.get('/query8', function (req, res) {
    connect.query(query8, function (err, result) {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).json(result).send()
    })
})

connect.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});



app.listen(3200)