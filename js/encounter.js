// SW5e monster data: https://sw5eapi.azurewebsites.net/api/monster
/*
I have learnt a valuable lesson from this exercise. I SHOULD have created a "monster" object at the start, and then created a "monsters" array.
If I had chosen this method, I could have just assigned each monster an id, and any values I needed could have been queried from that array. 
However, for some reason, I decided to assign each element in my monster table a unique id and query off of that... 
The reason this is an issue is that the innerHTMl I'm retrieving doesn't seem to match what is actually being rendered in the DOM. 
This is maddening. 

In addition to this, I have no doubt made many more mistakes. 

Just did a calculation. I have created unique IDs for all monster values. That means, I have created 270(at the time of writing) x 5 = 1350 unique IDs...
*/

// The main monster constructor used in the monster_arr
function Monster_obj(mName, mAC, mHP, mBehaviors) 
{
    this.monName = mName;
    this.AC = mAC;
    this.HP = mHP,
    this.behaviors = mBehaviors
}

// monster array used for cycling through monsters and accessing their properties. Probably should have included something like this in the beginning...
var monster_arr = [];

window.onload = function() 
{
    document.getElementById("create").addEventListener("click",function(){StartCreateEncounter()});
    //document.getElementById("searchButton").addEventListener("click",function(){SearchTable()});
    //document.getElementById("clearButton").addEventListener("click",function(){ClearSearch()});

    HideElementByID("encounterTable");
    HideElementByID("currrentEncounter");
}

// Called when "Create" button is pressed
function StartCreateEncounter()
{
    var monsters = [];
    var tools = null;

    let p = document.getElementsByTagName("p");
    p[0].style.display = "inline-block";

    //alert("started create encounter");
    tools = document.getElementsByClassName("tools");
    tools[0].style.display = "none";
    
    //var table = document.getElementById("encounterTable")

    GetMonsters().then(data => (monsters = data))
    .then(monsters => (PopulateTable(monsters)));
}

function PopulateTable(json)
{
    for (let i = 0; i < json.length; i++) 
    {
        CreateRowEncounterTable(i, json[i].name, json[i].armorClass, json[i].hitPoints, GetMonsterBehaviors(json[i]), json[i].challengeRating);
        //json[i].hitPoints
        //json[i].hitPointRoll
        //json[i].hitPoints + '<br>' + '(' + json[i].hitPoints + ')'

        //HideElementByID("defaultRow");
    }

    let p = document.getElementsByTagName("p");
    p[0].style.display = "none";
    ShowElementByID("encounterTable");
    document.getElementById("currrentEncounter").style.display = "block";

    // Putting this here for now... 
    InitialiseMonsterArray(json);
}

function sortTable(n)
{
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("encounterTable");
    switching = true;

    // Set the sorting direction to ascending:
    dir = "asc";
    
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) 
    {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;

        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) 
        {
            // Start by saying there should be no switching:
            shouldSwitch = false;

            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            if (n == 0) 
            {
                x = rows[i].getElementsByTagName("button")[n];
                y = rows[i + 1].getElementsByTagName("button")[n];    
            }
            else
            {
                x = rows[i].getElementsByTagName("td")[n];
                y = rows[i + 1].getElementsByTagName("td")[n];    
            }

            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") 
            {
                if (Number(x.innerHTML) > Number(y.innerHTML)) 
                {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } 
            else if (dir == "desc") 
            {
                if (Number(x.innerHTML) < Number(y.innerHTML)) 
                {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) 
        {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++;
        } 
        else 
        {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") 
            {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function SearchTable(id, col)
{
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(id).value;
    filter = input.toUpperCase();
    table = document.getElementById("encounterTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all rows and match those who don't match search query
    for (let i = 0; i < tr.length; i++) 
    {
        td = tr[i].getElementsByTagName("td")[col];
        if (td) 
        {
            txtValue = td.textContent || td.innerText
            if (txtValue.toUpperCase().indexOf(filter) > -1) 
            {
                tr[i].style.display = "";    
            }
            else
            {
                tr[i].style.display = "none";
            }
        }
    }
}

// This ruins the look of the table :)
// function ClearSearch()
// {
//     let table = document.getElementById("encounterTable");
//     buttons = table.getElementsByTagName("button");
    
// }

// [Fixed]For some godforsaken reason the returned array is just Zalaacas... Hundreds of Zalaacas
function InitialiseMonsterArray(json)
{
    for (let i = 0; i < json.length; i++) 
    {
        var tempMon = new Monster_obj(json[i].name, json[i].armorClass, json[i].hitPoints, GetMonsterBehaviors(json[i]));
        
        monster_arr[i] = tempMon;
    }
}

// The closest method searches up the dom until it finds a node with the specified tag
function RemoveMonster(t)
{
    t.closest('tr').remove();
}

function AddMonster(idNum)
{
    CreateRowCurrentEncounter(monster_arr[idNum].monName, monster_arr[idNum].AC, monster_arr[idNum].HP, monster_arr[idNum].behaviors);
}

function CreateRowCurrentEncounter(name, ac, hp, behaviors)
{
    behaviors = behaviors.replaceAll("<br>", "&#13");

    var table = document.getElementById("currrentEncounter");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = "<input type='text' value='"+name+"'><button id='removeMonsterButton' class='delMonsterButton' onclick='RemoveMonster(this)''>X</button></input>"
    cell2.innerHTML = "<input type='text' value='"+ac+"'>";
    cell3.innerHTML = "<input type='text' value='"+hp+"'>";
    cell4.innerHTML = "<textarea cols='50' rows='5'>"+behaviors+"</textarea>";
}

function CreateRowEncounterTable(id, name, ac, hp, behaviors, cr)
{
    var table = document.getElementById("encounterTable");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    //cell1.innerHTML = name;
    cell1.id = "monsterName" + id;
    cell1.outerHTML = "<td><button onclick=AddMonster("+ id +") class='addMonsterButton' id='addMonster" + id +"'>" + name +"</td></button>"

    cell2.innerHTML = ac;
    cell2.id = "monsterAC" + id;

    cell3.innerHTML = hp;
    cell3.id = "monsterHP" + id;

    cell4.innerHTML = behaviors;
    cell4.id = "monsterAttacks" + id;
    cell4.classList.add("monsterAttacks");

    cell5.innerHTML = cr;
    cell5.id = "monsterCR" + id;

}

async function GetMonsters()
{
    let response = await fetch('https://sw5eapi.azurewebsites.net/api/monster');
    let data = await response.json();
    return data;
}

function GetMonsterBehaviors(monster)
{
    var behaviors = monster.behaviors
    var description = "";
    for (let i = 0; i < behaviors.length; i++) 
    {
        //description = description + behaviors[i].name + '<br>' + behaviors[i].description + '<br><br>';
        description = description + behaviors[i].name + '<br>' + behaviors[i].description + '<br><br>';
    }

    return description
}

function HideElementByID(element)
{
    document.getElementById(element).style.display = "none";
}

function ShowElementByID(element)
{
    document.getElementById(element).style.display = "inline-block";
}