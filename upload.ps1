$ENV = Read-Host -Prompt 'Select PROD or STG'
ssh-agent
if ($ENV -eq 'PROD'){
    npm run build-prod-internal
    scp -r ./dist root@cotizadorpaldi.com.mx:/var/www
    ssh -t root@cotizadorpaldi.com.mx "cd /var/www && mv html html-$(Get-Date -UFormat "%m-%d-%Y-%T") && mv dist html"
}
else{
    npm run build-stg-internal
    scp -r ./dist root@192.241.238.176:/var/www
    ssh -t root@192.241.238.176       "cd /var/www && mv html html-$(Get-Date -UFormat "%m-%d-%Y-%T") && mv dist html"
}