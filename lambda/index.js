var https = require('https');
var mysql = require('mysql');
require('datejs');

var connection;

exports.handler = (event, context) => {

    try {

        connection = mysql.createConnection({
            host     : YOUR_HOST_NAME,
            user     : YOUR_USER_NAME,
            ssl : YOUR_SSL_NAME,
            password : YOUR_PASSWORD,
            database : YOUR_DB_NAME,
            port : YOUR_PORT_NUMBER,
        });

        if (event.session.new) {
            newSessionHelper(event, context);
        } else {
            oldSessionHelper(event, context);
        }
        

    } catch(error) { context.fail('Exception: '+error) }

}

newSessionHelper = (event,context) => {
    
    var userid = event.session.user.userId;
    var username;
    
    switch (event.request.type) {

        case "LaunchRequest":
            // Launch Request
            respondBack("You can ask for finding things, sharing memories, family information, schedule, etc.", true, {}, context);
            break;

        case "IntentRequest":
            // Intent Request
            switch(event.request.intent.name) {
                    
                    
                case "PersonalInformation":
                    var infovariable = event.request.intent.slots.personalinfo.value;
                    
                    getDBResponse("select uname from link where userId = '" + userid + "'", function(err, response){
                        if(response !== null && response !== undefined)
                        {
                            response = response[0];
                            username = response.uname;
                        }
                        
                        getDBResponse("Insert into recentlogs values ('"+ username +"', 'Personal Information', '" + infovariable + "', now())", function(){
                           
                        });
                        
                    });
                    
                    if(infovariable !== "age" && infovariable !== "birthdate")
                    {
                        var query = "select " + infovariable + " from link natural join personal where userId = '" + userid + "'";
                    }
                    else
                    {
                        var query = "select dob from link natural join personal where userId = '" + userid + "'";
                    }
                    
                    getDBResponse(query, function(err, response){
                       if(response !== null && response !== undefined)
                       {
                           if(infovariable === "name")
                           {
                               var res = response[0].name; 
                                respondBack("Your name is " +res, true, {}, context);
                           }
                           else if(infovariable === "address")
                           {
                               var res = response[0].address;
                                respondBack("Your home address is " +res, true, {}, context);
                           }
                           else if(infovariable === "age")
                           {
                               var today = new Date();
                               var birthday = new Date(response[0].dob);
                               var age = today.getFullYear() - birthday.getFullYear();
                               var m = today.getMonth() - birthday.getMonth();
                               
                               if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
                                age--;
                              }
                               
                              var res = age; 
                                respondBack("You are " + res + " years old.", true, {}, context);
                           }
                       }
                       else
                       {
                           respondBack("Sorry, I dont have that information.", true, {}, context);
                       }
                       connection.end(); 
                    });
                    break;
                    
                case "FindThings":
                    var itemName = event.request.intent.slots.thingsslot.value;
                    var query = "SELECT location from link natural join things where name = '" + itemName + "' and userId ='" + userid + "'";
                    
                    getDBResponse("select uname from link where userId = '" + userid + "'", function(err, response){
                        if(response !== null && response !== undefined)
                        {
                            response = response[0];
                            username = response.uname;
                        }
                        
                        getDBResponse("Insert into recentlogs values ('"+ username +"', 'Things', '" + itemName + "', now())", function(){
                           
                        });
                    });
                    
                    getDBResponse(query, function(err, response) {
                        if(response !== null && response !== undefined)
                        {
                            response = response[0];
                            var loc = response.location;
                            respondBack("It is usually located "+loc, true, {}, context);
                        } 
                        else if(itemName !== undefined)
                        {
                            respondBack("Sorry I don't know where it is. Do you want me to save the "+itemName+"'s location for you?", false, {
                                "itemName": itemName,
                                "context": "SaveThingsContext"
                            }, context);
                        } 
                        else errorResponse(context);
                        
                        connection.end();
                    });
                    
                    break;

                case "FindingObjectContext":
                    respondBack('What is it that you are looking for ?', false, {
                        "context": "FindingObjectContext"
                    }, context);
                    break;

                case "SaveThingsContext":
                    var itemName = event.request.intent.slots.thingsslot.value;
                    respondBack('Where exactly are you keeping your ' + itemName, false, {
                        "itemName": itemName,
                        "context": "SaveThingsContext"
                    }, context);
                    break;

                case "OthersMemory":
                    
                    if(event.request.intent.slots.personName.hasOwnProperty('value'))
                    {
                        person = ""+event.request.intent.slots.personName.value;
                        var query = "SELECT memory from link natural join memories where userId = '" + userid + "' and person = '" + person + "'";
                        
                        getDBResponse("select uname from link where userId = '" + userid + "'", function(err, response){
                        if(response !== null && response !== undefined)
                        {
                            response = response[0];
                            username = response.uname;
                        }
                        
                        getDBResponse("Insert into recentlogs values ('"+ username +"', 'Memory', '" + person + "', now())", function(){
                           
                        });
                    });
                        
                    }
                    else
                    {
                        var query = "SELECT memory from link natural join memories where userId = '" + userid + "' ORDER BY RAND() LIMIT 1";
                    }
                    
                    getDBResponse(query, function(err, response) {
                        if (response !== null) 
                        {
                            response = response[0];
                            respondBack(response.memory, true, {}, context);
                            
                            connection.end();
                        } 
                        else 
                        {
                            respondBack("Sorry, I don't have any memories right now.", false, {}, context);
                            connection.end();
                        }
                    });
                    break;

                case "FamilySearch":
                    if(event.request.intent.slots.personName.hasOwnProperty('value'))
                    {
                        var personName = ""+event.request.intent.slots.personName.value;
                        var query = "SELECT * from link natural join family where name = '" + personName + "' and userId = '" + userid + "'";
                        
                        getDBResponse("select uname from link where userId = '" + userid + "'", function(err, response){
                            if(response !== null && response !== undefined)
                            {
                                response = response[0];
                                username = response.uname;
                            }
                            
                            getDBResponse("Insert into recentlogs values ('"+ username +"', 'Family', '" + personName + "', now())", function(){
                               
                            });
                        });
                        
                        getDBResponse(query, function(err, response) {
                            if(response !== null) 
                            {
                                response = response[0];
                                respondBack(response.name + ' is your ' + response.relationship + ' who ' + response.description+'.', true, {}, context);
                            } 
                            else respondBack("Sorry, no such person found.", true, {}, context);
                            connection.end();
                        });
                        break;

                    } 
                    else if(event.request.intent.slots.personRelation.hasOwnProperty('value'))
                    {
                        var personRelation = ""+event.request.intent.slots.personRelation.value;
                        var query = "SELECT * from link natural join family where relationship = '" + personRelation + "' and userId = '" + userid + "'";
                        
                        getDBResponse("select uname from link where userId = '" + userid + "'", function(err, response){
                            if(response !== null && response !== undefined)
                            {
                                response = response[0];
                                username = response.uname;
                            }
                            
                            getDBResponse("Insert into recentlogs values ('"+ username +"', 'Family', '" + personRelation + "', now())", function(){
                               
                            });
                        });
                        
                        getDBResponse(query, function(err, response) {
                            if(response !== null) 
                            {
                                var responseText = "";
                                if(response.length === 1)
                                {
                                    responseText += response[0].name+' is your '+response[0].relationship+' who '+response[0].description+'.';
                                } 
                                else if(response.length > 1)
                                {
                                    responseText = "You have "+response.length+" "+personRelation+"s.";
                                    for(index in response) 
                                    {
                                        responseText += ' '+response[index].name+' is your '+response[index].relationship+' who '+response[index].description+'.';
                                    }
                                }
                                respondBack(responseText, true, {}, context);
                            } 
                            else respondBack("Sorry, I cannot find anyone with that relation.", true, {}, context);
                            connection.end();
                        });

                    } else errorResponse(context);
                    break;

                case "FamilySearchContext":
                    respondBack("Can you please provide this person's name?", false, {
                        "itemName": "",
                        "context": "FamilySearchContext"
                    }, context);
                    break;

                case "Schedule":
                    var day = ""+event.request.intent.slots.dateTime.value;

                    var today = new Date();
                    today = new Date(today.getTime() - (today.getTimezoneOffset() * 60000) + (3600000*(-5.0)));

                    getDBResponse("SELECT * FROM link natural join reminder where userId = '" + userid + "'", function(err, response) {
                        if(response !== null) {
                            var dateArray=[], dataArray=[];
                            for(var row in response){
                                var curDate = Date.parse(response[row].dateTime);
                                if(curDate.getDate() < today.getDate()) 
                                {
                                    getDBResponse("DELETE FROM reminder where dateTime='"+response[row].dateTime+"' and uname = (Select uname from link where userId = '" + userid + "')");
                                } 
                                else 
                                {
                                    dateArray.push(curDate);
                                    dataArray.push([response[row],curDate]);
                                }
                            }
                            //Sorting Data Array
                            dataArray = sort_data_by_date(dateArray, dataArray);

                            if(day === "next") {
                                dataArray = dataArray[0][0];
                                respondBack(dataArray.description+" on "+dataArray.dateTime+" at "+dataArray.location, true, {}, context);
                            } else {
                                get_Schedule(dataArray, day, today, context);
                            }

                        } else errorResponse(context);
                        connection.end();
                    });
                    break;

                default:
                    errorResponse(context);
            }
            break;

        case "SessionEndedRequest":
            // Session Ended Request
            break;

        default:
            context.fail('INVALID REQUEST TYPE: '+event.request.type);
    }
}

oldSessionHelper = (event, context) => {

    var userid = event.session.user.userId;
    var itemName,params,currentContext,query,prevContext, username;

    prevContext = event.session.attributes.context;
    currentContext = event.request.intent.name;
    
    getDBResponse("select uname from link where userId = '" + userid + "'", function(err, response){
        if(response !== null && response !== undefined)
        {
            response = response[0];
            username = response.uname;
        }
    });

    if(currentContext === "FindingObjectContext" || currentContext === "FindThings")
    {
        itemName = event.request.intent.slots.thingsslot.value;
    } 
    else if(currentContext === "SaveThingsLocation") 
    {
        itemName = event.session.attributes.itemName;
        params = event.request.intent.slots.thingsLocation.value;
    } 
    else if(currentContext === "DecisionBool") 
    {
        itemName = event.session.attributes.itemName;
        params = event.request.intent.slots.yesNoBool.value;
    }

    switch(true) {

        case currentContext === "FindingObjectContext" || currentContext === "FindThings":
            query = "SELECT location from link natural join things where name = '" + itemName + "' and userId ='" + userid + "'";
            
            getDBResponse(query, function(err, response) {
                
                if (response !== null && response !== undefined) {
                    response = response[0];
                    var loc = response.location;
                    respondBack("It is usually located "+loc, true, {}, context);
                    connection.end();
                } else {
                    respondBack("Sorry I don't know where it is. Do you want me to save the "+itemName+"'s location for you?", false, {
                        "itemName": itemName,
                        "context": "SaveThingsContext"
                    }, context);
                    connection.end();
                }
                
            });
            break;

        // case currentContext === "FamilySearch" && prevContext === "FamilySearchContext":
        //     if(event.request.intent.slots.personName.hasOwnProperty('value')){
        //         var personName = ""+event.request.intent.slots.personName.value;
        //         var query = "SELECT * from link natural join family where name = '" + personName + "' and userId = '" + userid + "'";

        //         getDBResponse(query, function(err, response) {
        //             console.log("MY DATA", response);
        //             if(response !== null){
        //                 response = response[0];
        //                 respondBack(response.name+' is your '+response.relationship+' who '+response.description, true, {}, context);
        //             } else respondBack("Sorry, no such person found.", true, {}, context);
        //             connection.end();
        //         });
        //         break;

        //     } else if(event.request.intent.slots.personRelation.hasOwnProperty('value')){
        //         var personRelation = ""+event.request.intent.slots.personRelation.value;
        //         var query = "SELECT location from things where name = '" + personRelation + "'";
        //         getDBResponse(query, function(err, response) {
        //             if(response !== null) {
        //                 response = response[0];
        //                 respondBack(response.name + ' is your ' + response.relationship + ' who ' + response.description, true, {}, context);
        //             } else respondBack("Sorry, no such person found.", true, {}, context);
        //             connection.end();
        //         });
        //         break;
        //     }
        //     break;

        case currentContext === "SaveThingsLocation" && prevContext === "SaveThingsContext":
            params = params.replace(/my/g, 'your');
            params = params.replace(/mine/g, 'yours');
            
            if(event.request.intent.slots.yesNoBool.hasOwnProperty('value') &&
                (event.request.intent.slots.yesNoBool.value === "no")) {
                respondBack("Okay, I won't remember that. What else can I help you with?", true,{},context);
            } else {
                
                getDBResponse("SELECT * FROM link natural join things WHERE name = '"+itemName+"' and userId = '" + userid + "'", function(err, response) {
                    
                    query = (response !== null) ? "UPDATE things SET location= '"+params+"' WHERE name = '"+itemName+"' and uname = (select uname from link where userId = '" + userid + "')" :
                    "INSERT INTO things (uname, name, location) VALUES ('" + username +"' , '" + itemName + "', '" + params + "')";
                    
                    getDBResponse(query, function() {
                        respondBack("Okay, I will remember "+itemName+"'s location.", true, {}, context);
                    
                         getDBResponse("Insert into recentlogs values ('"+ username +"', 'Things', '" + itemName + "', now())", function(){
                        
                        });
                        
                    });
                    
                    connection.end();
                });
                
            }
            
            break;

        case currentContext === "DecisionBool" && prevContext === "SaveThingsContext":
            if(params === "yes") {
                respondBack('Okay. Where exactly are you keeping your ' + itemName, false, {
                    "itemName": itemName,
                    "context": "SaveThingsContext"
                }, context);
            } else {
                respondBack("Okay, what else can I help you with ?", true,{},context);
            }
            break;

        default:
            errorResponse(context);
            break;

    }
}

//Reponse Cards
respondBack = (response, endSession, attributes, context) => {
    context.succeed(
        generateResponse(
            buildSpeechletResponse(response, endSession),
            attributes
        )
    )
}

errorResponse = (context) => {
    respondBack("I don't know what you meant by that. Can you please try again?", true, {}, context);
}

//DB Connection
getDBResponse = (query, callback) => {

    connection.query(query, function (err, rows) {
        if (err) throw err;
        if (rows[0] !== undefined) {
            if(callback)
                callback(null, rows);
        } else {
            if(callback)
                callback(null, null);
        }
    });
}


// Speechlet Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }

}

generateResponse = (speechletResponse, sessionAttributes) => {

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }

}

//Schedule Helpers
date_sort_asc = (date1, date2) => {
    if (date1 < date2) return -1;
    if (date1 > date2) return 1;
    return 0;
}

sort_data_by_date = (dateArray, dataArray) => {

    dateArray.sort(date_sort_asc);
    var result = [];
    dateArray.forEach(function(key) {
        var found = false;
        dataArray = dataArray.filter(function(item) {
            if(!found && item[1] === key) {
                result.push(item);
                found = true;
                return false;
            } else
                return true;
        });
    });
    return result;
}

get_Schedule = (dataArray, day, today, context) => {

    var result=[], searchDate = Date.parse(""+day), boolCheck=true;

    if(searchDate === null || searchDate === undefined || searchDate === "null") {
        errorResponse(context);
        return false;
    }
    dataArray = dataArray.filter(function(item) {
        var currDate = Date.parse(item[0].dateTime + "");
        if ((day === "today" &&
            currDate.getDate() === today.getDate() && currDate.getTime() >= today.getTime())
            ||  (currDate.getDate() >= today.getDate() && currDate.getDate() <= searchDate.getDate() &&
            currDate.getTime() >= today.getTime())) {
            result.push(item[0]);
            return false;
        } else return true;
    });

    if(result.length > 0) {
        var responseText= "";
        result.forEach(function (item) {
            if(boolCheck) {
                boolCheck = false;
                responseText += "" + item.description + " on "+ item.dateTime;
            } else {
                responseText += ". Followed by, "+item.description + " on "+ item.dateTime;
            }
        });
        respondBack(responseText, true, {}, context);
    } else {
        respondBack("You don't have anything scheduled for "+day, true, {}, context);
    }

}
