import { Controller, Get, Post, Body, Patch, Param, Delete, Header, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@/generated/prisma/enums';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    if (req.user.role === Role.ADMIN) {
      return this.formsService.findAll(null); // Admin sees all
    }
    return this.formsService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    if (req.user.role === Role.ADMIN) {
        return this.formsService.findOne(id, null);
    }
    return this.formsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    if (req.user.role === Role.ADMIN) {
        return this.formsService.update(id, updateFormDto, null);
    }
    return this.formsService.update(id, updateFormDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    if (req.user.role === Role.ADMIN) {
        return this.formsService.remove(id, null);
    }
    return this.formsService.remove(id, req.user.userId);
  }

  @Get(':id/exam')
  exam(@Param('id') id: string) {
    return this.formsService.exam(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportCsv(@Request() req: any, @Param('id') id: string, @Res() res: Response) {
    const csvString = await this.formsService.exportCsv(id);
    
    const BOM = '\uFEFF'; // UTF-8
    
    res.set({
      'Content-Disposition': `attachment; filename="resultados-${id}.csv"`,
    });
    
    res.send(BOM + csvString);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  getStats(@Request() req: any, @Param('id') id: string) {
    if (req.user.role === Role.ADMIN) {
        return this.formsService.getStats(id, null);
    }
    return this.formsService.getStats(id, req.user.userId);
  }
}
