module.exports = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
    <title>Expect Delays</title>
</head>

<body>
<div class="container">
<style>
    /*body {*/
    /*    background: black;*/
    /*}*/
    /*table td, table td * {*/
    /*    vertical-align: top;*/
    /*}*/
    
    /*table {*/
    /*    width: 100%;*/
    /*}*/
</style>
<table class="table table-striped table-sm">
  <thead>
      <tr>
          <th>Bowen</th>
          <th>HSB</th>
          <th>Status</th>
      </tr>
  
  </thead>
    <tbody>
    {{#each rows}}
        <tr>
            <td>{{ b.depart }}</td>
            <td/>
            <td/>
        </tr>
        <tr>
            <td></td>
            <td>{{ depart }}</td>
            <td>{{ delay }}  {{ capacity }}</td>
        </tr>
    {{/each}}
    </tbody>

</table>
</div>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
</body>

</html>
`
