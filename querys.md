

## Obtener solo los postres dentro de los menús

```
http://localhost:1337/api/daily-menus?[fields][0]=sumPrice&[populate][dessert_dish]=true
```

---

## Filtrar menús por rango de precios (GET /menus?min_precio=10&max_precio=15)

```
http://localhost:1337/api/daily-menus?filters[price][$gte]=10&filters[price][$lte]=15
```

---

## Filtrar por alérgenos

```
http://localhost:1337/api/menus/Alergenos?allergens=queso&allergens=Lactosa
```

---

## Obtener los platos más populares

```
http://localhost:1337/api/platos/populares
```