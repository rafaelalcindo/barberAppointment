import {startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date
}

class CreateAppointmentService {
  public async execute({ date, provider_id}: Request): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentInSameDate) {
      throw Error("this appointment is already booked");
    }

    const appointment = appointmentRepository.create({
      provider_id,
      date: appointmentDate
    })

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
