var Say = {

	"missingParam": "missing params",
	"invalidFormat":"invalid format",
	"invalidLength":"invalid length",
	"missingOpts":"Missing Options",
	"unknownValue":"unknown value"
		
}

/**
 * get method of a class/objects
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getMethods(obj)
{
    var res = [];
    for(var m in obj) {
        if(typeof obj[m] == "function") {
            res.push(m)
        }
    }
    return res;
}

var Validate = function(req){
	//create the erros array
	req.errors = [];
	//init
	this.req = req;
	this.say = Say;
	this.labels = [];
	return this;
}

/**
 * get nested keys using string
 * Usage findKey('x.s.d', object);
 * @param  {string}a like 'x.y.z'
 * @param  {object}b like {x:{y:{z:1}}}
 * @return {any} 
 */
Validate.prototype.findKeyInObject = function(s) {
	var o = this.req.body;
	try {
		s = s.replace(/\[(\w+)\]/g, '.$1'); 
	    s = s.replace(/^\./, '');
	    var a = s.split('.');
	    for (var i = 0, n = a.length; i < n; ++i) {
	        var k = a[i];
	        if (k in o) {
	            o = o[k];
	        } else {
	            return;
	        }
	    }
		return o;
	} catch(err) {
		return false;
	}
}

/**
 * accept error messages using a predefined keys
 * @param {Object} errorMessages 
 */
Validate.prototype.setMsgs= function(errorMessages){
	this.say = errorMessages || Say;
	return this;
};

/**
 * array of objects {param:'teamname' label:'Team Name'}
 * @param {Array} label [description]
 */
Validate.prototype.setLabels = function(labels=[]){
	this.labels = labels;
	return this;
}

Validate.prototype.injectLabel = function(obj){
	var f = this.labels.filter((x)=>{
		return (obj.param in x);
	})
	if(f.length == 0){
		var v = {};
		v[obj.param] = obj.label;
		this.labels.push(v);
	}
}


/**
 * check this.required params
 * @param  {[type]} objsArray {param:'x'}
 * @return {Boolean}             [description]
 */
Validate.prototype.required = function(paramValue, obj){

	if((obj.opts) && (!paramValue)){
		this.pushError(obj.param, this.say.missingParam);
	}
	return this;
}


/**
 * array of objects {param:'teamname' label:'Team Name'}
 * @param {Array} label [description]
 */
Validate.prototype.canBe = function(){


}


/**
 * if param exists it will check its regex validation
 * @param  {[objects]} objsArray {param: 'person.name', opts:{regex:'/a123/'}}     
 * @return {this}
 */
Validate.prototype.regex = function(paramValue, obj){

	//only if param exists - it doesn't check for this.required
	if(paramValue){
		//check if regex provided
		if(!obj.opts){
			this.pushError(obj.param, this.say.missingOpts+ "=>[Regex]"); return false;
		}
		//check regex validation
		var pattern = new RegExp(obj.opts);
		if(pattern.test(paramValue) == false){
			this.pushError(obj.param, this.say.invalidFormat);
		}
	}
	return this;
}


/**
 * check the length of provided param if exists
 * @param  {[obj]} objsArray {param: 'man.age', opts:{min:12, max:23}}
 * @return {this}         
 */
Validate.prototype.length = function(paramValue, obj){

	if(paramValue){
		if(!(paramValue.length >= parseInt(obj.opts.min)) || !(paramValue.length <= parseInt(obj.opts.max))){
			this.pushError(obj.param, `${this.say.invalidLength} ${obj.opts.min} to ${obj.opts.max} characters required`);
		}
	}
	
	return this;
}


/**
 * [valueType description]
 * @param  {[type]} objsArray {param: opts:any}
 * @return {[type]}           [description]
 */
Validate.prototype.type = function(paramValue, obj){
	
		if(paramValue){

			obj.opts = obj.opts.toString().toLowerCase();
			var error = 0;

			switch(obj.opts) {
			    case "string":
			        if(!(typeof paramValue === 'string')) error++;
			        break;
			    case "array":
			        if(!(Object.prototype.toString.call( paramValue ) === '[object Array]')) error++;
			        break;
			    case "number":
			        if(!(typeof paramValue === 'number')) error++;
			        break;
			    case "boolean":
			        if(!(typeof paramValue === 'boolean')) error++;
			        break;

			    case "date":
			    	if(!(Object.prototype.toString.call(paramValue) === "[object Date]")) error++;
			    	break;
			    default:
		        //do nothind
			}

			if(error>0){
				//show text error
				this.pushError(obj.param, this.say.invalidFormat);
			}

		}

	return this;

}


/**
 * check if value is one of options
 * @param  {[type]} this.req [description]
 * @param  {[objs]} objsArray [{param:'x.s.d', opts: Array}]
 * @return {void}     
 */
Validate.prototype.oneOf = function(paramValue, obj){
		if(paramValue){
			
			if(!(obj.opts.find(e=>e==paramValue))){
				this.pushError(obj.param, this.say.unknownValue)
			}
		}
        
		
	return this;
}

Validate.prototype.getErrors = function(){

	if(this.labels){
		this.req.errors.map((error)=>{
			var result = this.labels.filter((label)=>{
				return (label[error.param]);
			})
			result = result[0];
			error.label = (result)? result[error.param]:"";
		})
	}
	return this.req.errors;
}

Validate.prototype.hasErrors = function(){
	if(this.req.errors.length>0) return true;
	return false;
}

//push error to this.req.errors
Validate.prototype.pushError = function(param, message){
	this.req.errors.push(
		{
			msg: message,
			param: param
		}
	)
}


Validate.prototype.scenario = function(scenario){

	var methods = getMethods(this);
	var cmdList = [];

	for(method of methods){
		cmdList.push(
			{
				method: method,
				args: []
			}
		);
	}

	for(item of scenario){
		cmdList.map((cmd)=>{
			if(item[cmd.method]){

				cmd.args.push(
					{
						param: item.param,
						opts: item[cmd.method]

					}
				);

				//push to labels- so erros could be generated later
				this.injectLabel({param: item.param, label: item.label || "" });
			}  
		});
	}

	//make it done 
	cmdList = cmdList.filter((cmd)=>{
		return (cmd.args.length>0);
	})
	
	for(cmd of cmdList){
		for(arg of cmd.args){
			var paramValue = this.findKeyInObject(arg.param);
			this[cmd.method](paramValue, arg);
		}
	}

	return this;
}


module.exports = {
	validate: Validate
};