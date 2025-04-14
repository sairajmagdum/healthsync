import { route, procedure } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const userRouter = route({
	// Medical Profile CRUD
	updateMedicalProfile: procedure
		.input(
			z.object({
				dateOfBirth: z.date().optional(),
				gender: z.string().optional(),
				bloodGroup: z.string().optional(),
				phone: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.user.update({
				where: { id: session.user.id },
				data: input,
			});
		}),

	// Chronic Conditions CRUD
	getChronicConditions: procedure.query(async () => {
		const session = await auth.api.getSession({headers: await headers()})
		if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

		return prisma.chronicCondition.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: "desc" },
		});
	}),

	addChronicCondition: procedure
		.input(
			z.object({
				condition: z.string(),
				diagnosisDate: z.date().optional(),
				severity: z.string().optional(),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.chronicCondition.create({
				data: {
					...input,
					userId: session.user.id,
				},
			});
		}),

	updateChronicCondition: procedure
		.input(
			z.object({
				id: z.string(),
				condition: z.string().optional(),
				diagnosisDate: z.date().optional(),
				severity: z.string().optional(),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.chronicCondition.update({
				where: {
					id: input.id,
					userId: session.user.id,
				},
				data: input,
			});
		}),

	deleteChronicCondition: procedure
		.input(z.string())
		.mutation(async ({ input: id }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.chronicCondition.delete({
				where: {
					id,
					userId: session.user.id,
				},
			});
		}),

	// Allergies CRUD
	getAllergies: procedure.query(async () => {
		const session = await auth.api.getSession({headers: await headers()})
		if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

		return prisma.allergy.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: "desc" },
		});
	}),

	addAllergy: procedure
		.input(
			z.object({
				type: z.string(),
				name: z.string(),
				severity: z.string().optional(),
				reaction: z.string().optional(),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.allergy.create({
				data: {
					...input,
					userId: session.user.id,
				},
			});
		}),

	updateAllergy: procedure
		.input(
			z.object({
				id: z.string(),
				type: z.string().optional(),
				name: z.string().optional(),
				severity: z.string().optional(),
				reaction: z.string().optional(),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.allergy.update({
				where: {
					id: input.id,
					userId: session.user.id,
				},
				data: input,
			});
		}),

	deleteAllergy: procedure.input(z.string()).mutation(async ({ input: id }) => {
		const session = await auth.api.getSession({headers: await headers()})
		if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

		return prisma.allergy.delete({
			where: {
				id,
				userId: session.user.id,
			},
		});
	}),

	// Current Medications CRUD
	getCurrentMedications: procedure.query(async () => {
		const session = await auth.api.getSession({headers: await headers()})
		if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

		return prisma.currentMedication.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: "desc" },
		});
	}),

	addCurrentMedication: procedure
		.input(
			z.object({
				name: z.string(),
				dosage: z.string(),
				frequency: z.string(),
				startDate: z.date(),
				endDate: z.date().optional(),
				prescribedBy: z.string().optional(),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.currentMedication.create({
				data: {
					...input,
					userId: session.user.id,
				},
			});
		}),

	updateCurrentMedication: procedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				dosage: z.string().optional(),
				frequency: z.string().optional(),
				startDate: z.date().optional(),
				endDate: z.date().optional(),
				prescribedBy: z.string().optional(),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.currentMedication.update({
				where: {
					id: input.id,
					userId: session.user.id,
				},
				data: input,
			});
		}),

	deleteCurrentMedication: procedure
		.input(z.string())
		.mutation(async ({ input: id }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.currentMedication.delete({
				where: {
					id,
					userId: session.user.id,
				},
			});
		}),

	// Insurance CRUD
	getInsurances: procedure.query(async () => {
		const session = await auth.api.getSession({headers: await headers()})
		if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

		return prisma.insurance.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: "desc" },
		});
	}),

	addInsurance: procedure
		.input(
			z.object({
				provider: z.string(),
				policyNumber: z.string(),
				groupNumber: z.string().optional(),
				coverageType: z.string(),
				startDate: z.date(),
				endDate: z.date().optional(),
				isActive: z.boolean().default(true),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.insurance.create({
				data: {
					...input,
					userId: session.user.id,
				},
			});
		}),

	updateInsurance: procedure
		.input(
			z.object({
				id: z.string(),
				provider: z.string().optional(),
				policyNumber: z.string().optional(),
				groupNumber: z.string().optional(),
				coverageType: z.string().optional(),
				startDate: z.date().optional(),
				endDate: z.date().optional(),
				isActive: z.boolean().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.insurance.update({
				where: {
					id: input.id,
					userId: session.user.id,
				},
				data: input,
			});
		}),

	deleteInsurance: procedure
		.input(z.string())
		.mutation(async ({ input: id }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.insurance.delete({
				where: {
					id,
					userId: session.user.id,
				},
			});
		}),

	// Appointments CRUD
	getAppointments: procedure.query(async () => {
		const session = await auth.api.getSession({headers: await headers()})
		if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

		return prisma.appointment.findMany({
			where: { userId: session.user.id },
			orderBy: { date: "asc" },
		});
	}),

	addAppointment: procedure
		.input(
			z.object({
				doctorName: z.string(),
				hospitalName: z.string().optional(),
				date: z.date(),
				time: z.string(),
				type: z.string(),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.appointment.create({
				data: {
					...input,
					userId: session.user.id,
					status: "Scheduled",
				},
			});
		}),

	updateAppointment: procedure
		.input(
			z.object({
				id: z.string(),
				doctorName: z.string().optional(),
				hospitalName: z.string().optional(),
				date: z.date().optional(),
				time: z.string().optional(),
				type: z.string().optional(),
				status: z.string().optional(),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.appointment.update({
				where: {
					id: input.id,
					userId: session.user.id,
				},
				data: input,
			});
		}),

	deleteAppointment: procedure
		.input(z.string())
		.mutation(async ({ input: id }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.appointment.delete({
				where: {
					id,
					userId: session.user.id,
				},
			});
		}),

	// Medical Records CRUD
	getMedicalRecords: procedure.query(async () => {
		const session = await auth.api.getSession({headers: await headers()})
		if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

		return prisma.medicalRecord.findMany({
			where: { userId: session.user.id },
			orderBy: { date: "desc" },
		});
	}),

	addMedicalRecord: procedure
		.input(
			z.object({
				recordType: z.string(),
				title: z.string(),
				description: z.string().optional(),
				date: z.date(),
				doctorName: z.string().optional(),
				hospitalName: z.string().optional(),
				fileUrl: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.medicalRecord.create({
				data: {
					...input,
					userId: session.user.id,
				},
			});
		}),

	updateMedicalRecord: procedure
		.input(
			z.object({
				id: z.string(),
				recordType: z.string().optional(),
				title: z.string().optional(),
				description: z.string().optional(),
				date: z.date().optional(),
				doctorName: z.string().optional(),
				hospitalName: z.string().optional(),
				fileUrl: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.medicalRecord.update({
				where: {
					id: input.id,
					userId: session.user.id,
				},
				data: input,
			});
		}),

	deleteMedicalRecord: procedure
		.input(z.string())
		.mutation(async ({ input: id }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.medicalRecord.delete({
				where: {
					id,
					userId: session.user.id,
				},
			});
		}),

	// Prescriptions CRUD
	getPrescriptions: procedure.query(async () => {
		const session = await auth.api.getSession({headers: await headers()})
		if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

		return prisma.prescription.findMany({
			where: { userId: session.user.id },
			orderBy: { startDate: "desc" },
		});
	}),

	addPrescription: procedure
		.input(
			z.object({
				doctorName: z.string(),
				medication: z.string(),
				dosage: z.string(),
				frequency: z.string(),
				startDate: z.date(),
				endDate: z.date().optional(),
				refills: z.number().default(0),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.prescription.create({
				data: {
					...input,
					userId: session.user.id,
					status: "Active",
				},
			}); 
		}),

	updatePrescription: procedure
		.input(
			z.object({
				id: z.string(),
				doctorName: z.string().optional(),
				medication: z.string().optional(),
				dosage: z.string().optional(),
				frequency: z.string().optional(),
				startDate: z.date().optional(),
				endDate: z.date().optional(),
				refills: z.number().optional(),
				status: z.string().optional(),
				notes: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.prescription.update({
				where: {
					id: input.id,
					userId: session.user.id,
				},
				data: input,
			});
		}),

	deletePrescription: procedure
		.input(z.string())
		.mutation(async ({ input: id }) => {
			const session = await auth.api.getSession({headers: await headers()})
			if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

			return prisma.prescription.delete({
				where: {
					id,
					userId: session.user.id,
				},
			});
		}),
});

export default userRouter;
