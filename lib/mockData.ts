export type RiskLevel = "Low" | "Medium" | "High";

export interface StudentRecord {
	id: string;
	name: string;
	className: string;
	subject: string;
	teacherId: string;
	attendancePercent: number; // 0-100
	scorePercent: number; // 0-100
	feeStatus: "Paid" | "Due" | "Overdue";
	riskLevel?: RiskLevel; // Optional - will be predicted by AI
	aiPredicted?: boolean; // Flag to indicate if risk was predicted by AI
}

// Generate AI-predicted risk levels for a provided list of students
export async function getStudentsWithAIPredictionsFrom(input: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[]): Promise<StudentRecord[]> {
    const studentsWithoutRisk = input.map((student) => student);

    const studentsWithPredictions = await Promise.all(
        studentsWithoutRisk.map(async (student) => {
            const predictedRisk = await predictStudentRisk(student);
            return {
                ...student,
                riskLevel: predictedRisk,
                aiPredicted: true,
            } as StudentRecord;
        })
    );

    return studentsWithPredictions;
}

export interface TeacherRecord {
	id: string;
	name: string;
	subject: string;
	email: string;
}

export interface SubjectRecord {
	id: string;
	name: string;
	createdAt: string; // ISO date
}

export const teachers: TeacherRecord[] = [
	{ id: "t1", name: "Aarav Mehta", subject: "Mathematics", email: "aarav.mehta@example.com" },
	{ id: "t2", name: "Divya Sharma", subject: "Science", email: "diya.sharma@example.com" },
	{ id: "t3", name: "Kabir Patel", subject: "English", email: "kabir.patel@example.com" },
	{ id: "t4", name: "Isha Nair", subject: "History", email: "isha.nair@example.com" },
];

export const subjects: SubjectRecord[] = [
	{ id: "s1", name: "Mathematics", createdAt: "2024-01-10" },
	{ id: "s2", name: "Science", createdAt: "2024-02-14" },
	{ id: "s3", name: "English", createdAt: "2024-03-05" },
	{ id: "s4", name: "History", createdAt: "2024-04-19" },
];

export const students: StudentRecord[] = [
	{
		id: "stu1",
		name: "Riya Verma",
		className: "10-A",
		subject: "Mathematics",
		teacherId: "t1",
		attendancePercent:29,
		scorePercent: 68,
		feeStatus: "Due",
	},
	{
		id: "stu2",
		name: "Arjun Singh",
		className: "10-B",
		subject: "Science",
		teacherId: "t2",
		attendancePercent: 68,
		scorePercent: 72,
		feeStatus: "Due",
	},
	{
		id: "stu3",
		name: "Meera Das",
		className: "9-A",
		subject: "English",
		teacherId: "t3",
		attendancePercent: 54,
		scorePercent: 61,
		feeStatus: "Overdue",
	},
	{
		id: "stu4",
		name: "Vihaan Rao",
		className: "9-B",
		subject: "History",
		teacherId: "t4",
		attendancePercent: 85,
		scorePercent: 79,
		feeStatus: "Paid",
	},
	{
		id: "stu5",
		name: "Anika Kapoor",
		className: "10-A",
		subject: "Mathematics",
		teacherId: "t1",
		attendancePercent: 73,
		scorePercent: 66,
		feeStatus: "Due",
	},
];

export const attendanceTrend: { date: string; attendance: number }[] = [
	{ date: "2025-08-01", attendance: 92 },
	{ date: "2025-08-08", attendance: 88 },
	{ date: "2025-08-15", attendance: 90 },
	{ date: "2025-08-22", attendance: 86 },
	{ date: "2025-08-29", attendance: 89 },
	{ date: "2025-09-05", attendance: 91 },
];

// Risk distribution will be calculated dynamically based on AI predictions
export const getRiskDistribution = (studentsWithRisk: StudentRecord[]) => [
	{ name: "Low", value: studentsWithRisk.filter(s => s.riskLevel === "Low").length, color: "#34d399" },
	{ name: "Medium", value: studentsWithRisk.filter(s => s.riskLevel === "Medium").length, color: "#f59e0b" },
	{ name: "High", value: studentsWithRisk.filter(s => s.riskLevel === "High").length, color: "#ef4444" },
];

export const getTeacherById = (id: string) => teachers.find(t => t.id === id);

// Function to convert fee status to number for AI model
function feeStatusToNumber(feeStatus: "Paid" | "Due" | "Overdue"): number {
	return feeStatus === "Paid" ? 1 : 0;
}

// Function to predict risk level using AI (fallback to simple logic if AI unavailable)
export async function predictStudentRisk(student: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>): Promise<RiskLevel> {
	try {
		// Try to call the AI predictor API
		const response = await fetch('/api/predict-risk', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				marks: student.scorePercent,
				attendance: student.attendancePercent,
				fee_payment: feeStatusToNumber(student.feeStatus)
			})
		});

		if (response.ok) {
			const prediction = await response.json();
			return prediction.risk as RiskLevel;
		}
	} catch (error) {
		console.log('AI predictor not available, using fallback logic');
	}

	// Fallback logic based on your training data patterns
	if (student.scorePercent < 50 || student.attendancePercent < 60 || student.feeStatus !== "Paid") {
		return "High";
	} else if (student.scorePercent < 70 || student.attendancePercent < 80) {
		return "Medium";
	}
	return "Low";
}

// Function to get students with AI-predicted risk levels
export async function getStudentsWithAIPredictions(): Promise<StudentRecord[]> {
	const studentsWithoutRisk = students.map(({ riskLevel, aiPredicted, ...student }) => student);
	
	const studentsWithPredictions = await Promise.all(
		studentsWithoutRisk.map(async (student) => {
			const predictedRisk = await predictStudentRisk(student);
			return {
				...student,
				riskLevel: predictedRisk,
				aiPredicted: true
			};
		})
	);

	return studentsWithPredictions;
}

// Totals will be calculated dynamically based on AI predictions
export const getTotals = (studentsWithRisk: StudentRecord[]) => ({
	totalStudents: studentsWithRisk.length,
	atRiskStudents: studentsWithRisk.filter(s => s.riskLevel !== "Low").length,
	avgAttendance: Math.round(
		studentsWithRisk.reduce((acc, s) => acc + s.attendancePercent, 0) / Math.max(1, studentsWithRisk.length)
	),
	avgScores: Math.round(
		studentsWithRisk.reduce((acc, s) => acc + s.scorePercent, 0) / Math.max(1, studentsWithRisk.length)
	),
});


