let student = students.find( (student) =>
  { return student.name === req.params.name });

if (student) {
  student.classes[req.params.class] = parseInt(req.params.grade);
  res.status(201).send( 'Student ' + req.params.name + ' was assigned a grade of ' + req.params.grade + ' in ' + req.params.class );
} else {
  res.status(404).send('Student with a name ' + req.params.name  + ' was not found.');
}