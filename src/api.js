export async function api(path,options={}) {
  const {body,...rest}=options;
  const response=await fetch(`/api${path}`,{credentials:'same-origin',...rest,headers:{...(body&&!(body instanceof FormData)?{'Content-Type':'application/json'}:{}),...rest.headers},body:body instanceof FormData?body:body?JSON.stringify(body):undefined});
  const data=await response.json();if(!response.ok){const err=new Error(data.error||'Request failed.');err.fields=data.fields;err.status=response.status;throw err;}return data;
}
