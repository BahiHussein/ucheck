let Ucheck = require('./index');

let x =  [

    {
        param: 'date',
        label: 'date',
        required: true,
        canParse: 'date'
    }
]

let ucheck = new Ucheck.validate({
    body: {
        date: 1
    }
}).scenario(x); 

if(ucheck.hasErrors()){
    console.log('has errors ');
    console.log(ucheck.getErrors())
} else {
    console.log('success');
}




