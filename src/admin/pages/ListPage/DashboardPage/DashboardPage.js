import React, { useState } from "react";
import { Card, CardContent, Button, MenuItem, Select, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

const courses = ["Math 101", "Physics 202", "Computer Science 303"];
const studentsData = {
  "Math 101": [
    { id: 1, name: "Alice", grade: "B" },
    { id: 2, name: "Bob", grade: "A" },
  ],
  "Physics 202": [
    { id: 3, name: "Charlie", grade: "C" },
    { id: 4, name: "David", grade: "B" },
  ],
  "Computer Science 303": [
    { id: 5, name: "Eve", grade: "A" },
    { id: 6, name: "Frank", grade: "D" },
  ],
};

function DashboardPage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);

  const handleCourseChange = (event) => {
    const course = event.target.value;
    setSelectedCourse(course);
    setStudents(studentsData[course] || []);
  };

  const handleGradeChange = (id, newGrade) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, grade: newGrade } : student
      )
    );
  };

  const handleSubmit = () => {
    console.log("Updated Grades:", students);
    alert("Grades submitted successfully!");
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>Submit Grades</h1>
      <Card>
        <CardContent>
          <Select fullWidth value={selectedCourse} onChange={handleCourseChange} displayEmpty>
            <MenuItem value="" disabled>Select a course</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course} value={course}>{course}</MenuItem>
            ))}
          </Select>
        </CardContent>
      </Card>

      {selectedCourse && (
        <Card style={{ marginTop: "16px" }}>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Select
                        value={student.grade}
                        onChange={(event) => handleGradeChange(student.id, event.target.value)}
                      >
                        {["A", "B", "C", "D", "F", "I"].map((grade) => (
                          <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button style={{ marginTop: "16px" }} variant="contained" color="primary" onClick={handleSubmit}>
              Submit Grades
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DashboardPage;