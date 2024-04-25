import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../services/$types';
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export const load = (async ({cookies}) => {
    let username = cookies.get("username")
    let id = cookies.get("token_id")
    if(!id){
        throw redirect(303, "/Login")
    }
    const serviceList = await prisma.service.findMany({select: {isLikedBy: true, name: true, id: true, description: true, username: true, user: {select: {name: true}}}})

    return {username, serviceList};
}) satisfies PageServerLoad;


export const actions: Actions = {
    create: async ({request, cookies}) => {
        let data = await request.formData();
        let username = cookies.get("username")?.toString();
        let serviceName = data.get("serviceName")?.toString();
        let description = data.get("description")?.toString();
        let numberOfLikes = 0;

        if(!serviceName){
            return fail(400, {serviceName: "Namn på tjänsten saknas."})
        }
        else if(!description){
            return fail(400, {serviceName: "Beskrivning saknas."})
        }
        
        else if(await prisma.service.findFirst({where: {name: serviceName?.toString()}})){
            return fail(400, {serviceName: "Denna tjänst finns redan. Välj ett annat namn."})
        }

        const User = await prisma.user.findFirst({where: {name: username}});
        if(User && username && description){
            await prisma.service.create({data: {
                name: serviceName?.toString(),
                username: username?.toString(),
                description: description?.toString(),
                isAdminApproved: false,
                user: { connect: { name: username } },                
            }})
        } else{
            return fail(400, {serviceName: "Unable to find user"})
        }        
        
    },
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
}