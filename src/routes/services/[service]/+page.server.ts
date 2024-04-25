import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export const load = (async ({cookies, params}) => {
    let username = cookies.get("username")
    let id = cookies.get("token_id")
    if(!username || !id){
        throw redirect(303, "/login")
    }

    const serviceName = params.service
    const service = await prisma.service.findFirst({
        where: {
            name: serviceName
        },
        include: {isLikedBy: {select: {name: true}}}
    });

    if(!service){
        throw redirect(303, "/services")
    }

    const user = await prisma.user.findFirst({where: {name: username}});

    return {username, service, user};
}) satisfies PageServerLoad;

export const actions: Actions = {
    addLike: async ({request, cookies}) => {
        let data = await request.formData();
        let username = cookies.get("username")?.toString();
        let serviceName = data.get("serviceName")?.toString();
        let serviceId = parseInt(data.get("serviceId")?.toString() ?? "0");

        const service = await prisma.service.findUnique({where: {id: serviceId, name: serviceName}, select: {isLikedBy: true}})
        if (!service){
            return fail(400, {serviceName: "Unable to find service."})
        }

        const user = await prisma.user.findFirst({where: {name: username}})

        if (!user){
            return fail(400, {serviceName: "Unable to find user."})
        }

        await prisma.service.update({where: {id: serviceId, name: serviceName}, data: {isLikedBy: {connect: {name: username}}}})

    },
    removeLike: async ({request, cookies}) => {
        let data = await request.formData();
        let username = cookies.get("username")?.toString();
        let serviceName = data.get("serviceName")?.toString();
        let serviceId = parseInt(data.get("serviceId")?.toString() ?? "0");

        const service = await prisma.service.findUnique({where: {id: serviceId, name: serviceName}, select: {isLikedBy: true}})
        if (!service){
            return fail(400, {serviceName: "Unable to find service."})
        }

        const user = await prisma.user.findFirst({where: {name: username}})

        if (!user){
            return fail(400, {serviceName: "Unable to find user."})
        }

        await prisma.service.update({where: {id: serviceId, name: serviceName}, data: {isLikedBy: {disconnect: {name: username}}}})

    },
  };