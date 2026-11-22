var submit_btn = document.getElementById("submitlabel")

var form_fields = document.querySelectorAll("fieldset");
var fieldset_values = {}
 
var ideology_colors = {
    dem: "hsl(225, 70%, 50%)",
    fas: "hsl(30, 70%, 50%)",
    com: "hsl(0, 70%, 50%)",
    neu: "hsl(0, 0%, 70%)"
}

form_fields.forEach (function(form_field){
    var ideology_values = {}
    
    var sliders = form_field.querySelectorAll("input[type='range']");
    var total = form_field.getElementsByClassName("total_value")[0]
    var pie = form_field.getElementsByClassName("ideology_pie")[0]

    sliders.forEach (function(slider){
        var outputId = slider.name + "_value";
        var pie_ideology = slider.name;
        if (!ideology_values[pie_ideology]) {
            ideology_values[pie_ideology] = 0
        }

        console.log("outputId: " + outputId)
        console.log("outputId: " + slider.name)
        var output = form_field.getElementsByClassName(outputId)[0]
        output.innerHTML = slider.value
        total.innerHTML = 0
        

        slider.oninput = function() {
            var tot = 0
            for (const [ide, value] of Object.entries(ideology_values)) {
                if (slider.name != ide) {
                    console.log("IDEOLOGY: " + ide + " VALUE: " + value)
                    tot += Number(value)
                } else {
                    tot += Number(this.value)
                }
            }

            if (tot > 100) {
                var temp_total = 100
                console.log(this.name)
                for (const [ide, value] of Object.entries(ideology_values)) {
                    if (this.name != ide) {
                        temp_total -= value
                        console.log(temp_total + " - " + value)
                    }
                }
                this.value = temp_total
                tot = 100
            }

            output.innerHTML = this.value
            total.innerHTML = tot
            ideology_values[pie_ideology] = this.value
            
            var percent = (this.value-this.min)/(this.max-this.min)*100
            var color = ideology_colors[pie_ideology]

            var dem_deg = ideology_values["dem"]*3.6
            var fas_deg = ideology_values["fas"]*3.6
            var com_deg = ideology_values["com"]*3.6
            var neu_deg = ideology_values["neu"]*3.6

            console.log("DEM = " + dem_deg + " FAS = " + fas_deg)

            console.log("PERCENT: " + (this.value-this.min) + " DIVIDED BY " + this.max + " - " + this.min + " EQUALS " + percent)
            console.log("linear-gradient(to right, " + color + " " + percent + "%, gray " + percent + "%)")
            this.style.background = "linear-gradient(to right, " + color + " " + percent + "%, gray " + percent + "%)"
            
            pie.style.background = "conic-gradient(from 0deg, " + ideology_colors["dem"] + " 0deg " + dem_deg + "deg, " + ideology_colors["fas"] + " " + dem_deg + "deg " + (dem_deg+fas_deg) + "deg, " + ideology_colors["com"] + " " + (dem_deg+fas_deg) + "deg " + (dem_deg+fas_deg+com_deg) + "deg, " + ideology_colors["neu"] + " " + (dem_deg+fas_deg+com_deg) + "deg " + (dem_deg+fas_deg+com_deg+neu_deg) + "deg, white " + (dem_deg+fas_deg+com_deg+neu_deg) + "deg 360deg)"
        }
        fieldset_values[form_field.id.split("_").at(-1)] = ideology_values
    })
})

document.addEventListener("DOMContentLoaded", function () {
    const fbform = document.getElementById("cga_pol_form")

    fbform.addEventListener("submit", async function (event) {
        event.preventDefault()
        var can_submit = true
        var tot = 0
        Object.entries(fieldset_values).forEach(([question, tbl]) => {
            for (const value of Object.entries(tbl)) {
                console.log("QUESTION " + question + ": " + value[0] + " = " + value[1])
                tot += Number(value[1])
                }
                console.log("Attempting Submission... Total is " + tot)
                if (tot != 100) {
                    can_submit = false
                    return
                }
                tot = 0
            })
        
        if (can_submit == false) {
            //alert("All values must add up to 100 for each question!")
            var submit_btn_og_text = submit_btn.innerHTML
            submit_btn.innerHTML = "All totals must be 100!"
            setTimeout(function() {
                submit_btn.innerHTML = submit_btn_og_text
            }, 3000)
        } else {
            const formBody = new URLSearchParams()
            var i = 0
            
            form_fields.forEach (async function(form_field) {
                i += 1

                var question = form_field.querySelector('.ques')
                var inputs = form_field.querySelectorAll('input')

                formBody.append("ques-" + i + "_title", question?.textContent ?? "QUESTION " + i)
                inputs.forEach(input_value => {
                    if (input_value.type == "range") {
                        formBody.append("ques-" + i + "_" + input_value.name, input_value.value)
                    }
                });
            })
            try {
                const response = await fetch("https://script.google.com/macros/s/AKfycbyH6v_oRQ9ZZS3TxSbDnETRf2xHvOmyu391OAZBfMaQm91YFMydFVwcCUXqNc41wuFajA/exec", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: formBody.toString()
                });
                const responseText = await response.text()
                console.log("Response: ", responseText)
                alert("Sent!")
                formBody.reset()
            } catch (error) {
                console.log("ERROR: ", error)
            }
        }
    })
})