
##Obtener solo los postres dentro de los menús 

http://localhost:1337/api/daily-menus?[fields][0]=Price&[populate][Dessert]=true

#Filtrar menús por rango de precios (GET /menus?min_precio=10&max_precio=15).
http://localhost:1337/api/daily-menus?filters[Price][$gte]=10&filters[Price][$lte]=15

#firtrar por alergenos 
http://localhost:1337/api/menus/Alergenos?allergens=queso&allergens=Lactosa

#mas populares 
http://localhost:1337/api/platos/populares
