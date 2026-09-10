import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/config/prisma';

describe('Task Management REST API Integration Tests', () => {
  let testProjectId: string;
  let testTaskId: string;

  beforeAll(async () => {
    // Ensure database connection is ready
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up test data if any left
    if (testProjectId) {
      await prisma.project.deleteMany({ where: { id: testProjectId } });
    }
    await prisma.$disconnect();
  });

  // 1. Health check
  describe('GET /api/health', () => {
    it('harus mengembalikan status 200 dan status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // 2. Project Endpoints
  describe('Project CRUD & Validasi', () => {
    it('harus menolak pembuatan project jika judul kosong (validasi Zod)', async () => {
      const res = await request(app).post('/api/projects').send({
        title: '',
        description: 'Tanpa judul',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Validasi data gagal');
    });

    it('harus berhasil membuat project baru', async () => {
      const res = await request(app).post('/api/projects').send({
        title: 'Project Uji Integrasi',
        description: 'Dibuat saat automated test dijalankan',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Project Uji Integrasi');

      testProjectId = res.body.data.id;
    });

    it('harus dapat mengambil seluruh daftar project', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('harus dapat mengambil detail project berdasarkan ID', async () => {
      const res = await request(app).get(`/api/projects/${testProjectId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testProjectId);
      expect(res.body.data.taskStats).toBeDefined();
    });

    it('harus dapat memperbarui informasi project', async () => {
      const res = await request(app)
        .patch(`/api/projects/${testProjectId}`)
        .send({ title: 'Project Uji Integrasi (Diperbarui)' });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Project Uji Integrasi (Diperbarui)');
    });
  });

  // 3. Task Endpoints
  describe('Task CRUD & Validasi', () => {
    it('harus menolak pembuatan task jika prioritas atau status tidak valid', async () => {
      const res = await request(app).post('/api/tasks').send({
        title: 'Task Tidak Valid',
        projectId: testProjectId,
        status: 'status_palsu',
        priority: 'prioritas_palsu',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('harus berhasil membuat task baru dalam project', async () => {
      const res = await request(app).post('/api/tasks').send({
        title: 'Task Pertama Uji Coba',
        description: 'Deskripsi task integrasi',
        status: 'todo',
        priority: 'high',
        projectId: testProjectId,
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Task Pertama Uji Coba');
      expect(res.body.data.priority).toBe('high');

      testTaskId = res.body.data.id;
    });

    it('harus dapat memfilter task berdasarkan projectId dan status', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .query({ projectId: testProjectId, status: 'todo' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('harus berhasil mengubah status task menjadi in_progress', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${testTaskId}`)
        .send({ status: 'in_progress' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('in_progress');
    });

    it('harus berhasil menghapus task', async () => {
      const res = await request(app).delete(`/api/tasks/${testTaskId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // 4. Cascading delete test
  describe('Cascading Delete Relationship', () => {
    it('harus menghapus task secara otomatis saat project dihapus (cascade delete)', async () => {
      // Buat task baru dalam project
      const taskRes = await request(app).post('/api/tasks').send({
        title: 'Task Cascade Test',
        projectId: testProjectId,
        status: 'todo',
      });
      const cascadeTaskId = taskRes.body.data.id;

      // Hapus project
      const deleteProjectRes = await request(app).delete(`/api/projects/${testProjectId}`);
      expect(deleteProjectRes.status).toBe(200);

      // Cek apakah task masih ada (harus 404)
      const checkTaskRes = await request(app).get(`/api/tasks/${cascadeTaskId}`);
      expect(checkTaskRes.status).toBe(404);

      testProjectId = '';
    });
  });
});
