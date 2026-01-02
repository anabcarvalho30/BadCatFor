import { prisma } from '../lib/prisma.js';
import { supabase } from '../lib/supabase.js'; // <--- IMPORTANTE: Importar o cliente Supabase
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  // 1. Pegamos também a 'bio' do corpo da requisição
  const { name, email, password, bio } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'Email já cadastrado' });

    // --- LÓGICA DE UPLOAD PARA O SUPABASE ---
    
    // Função auxiliar interna para subir arquivos
    const uploadToSupabase = async (file, folder) => {
      // Cria um nome único: pasta/timestamp-nomeoriginal (sem espaços)
      const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s/g, '')}`;
      
      const { data, error } = await supabase.storage
        .from('uploads') // <--- NOME DO SEU BUCKET (Crie no painel do Supabase!)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) throw error;

      // Pega a URL pública
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    };

    let photoUrl = null;
    let bannerUrl = null;

    // Verifica se existem arquivos na requisição (adicionados pelo Multer)
    if (req.files) {
      // Se tiver foto, faz upload
      if (req.files['photo']) {
        photoUrl = await uploadToSupabase(req.files['photo'][0], 'profiles');
      }
      // Se tiver banner, faz upload
      if (req.files['banner']) {
        bannerUrl = await uploadToSupabase(req.files['banner'][0], 'banners');
      }
    }
    // ----------------------------------------

    const hash = await bcrypt.hash(password, 10);

    // Cria o usuário salvando as novas informações
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hash, // Mantive o nome do campo como você usa
        bio: bio || null,   // Salva a bio ou null se não tiver
        photo: photoUrl,    // Salva a URL do Supabase ou null
        banner: bannerUrl,  // Salva a URL do Supabase ou null
      },
    });

    user.passwordHash = undefined;
    return res.status(201).json(user);

  } catch (error) {
    console.error("ERRO DETALHADO NO REGISTRO:", error);
    return res.status(500).json({ 
      error: 'Erro ao registrar usuário', 
      details: error.message 
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    user.passwordHash = undefined;
    return res.json({ user, token });
  } catch (error) {
    console.error(error); // Bom logar o erro no console para debug
    return res.status(500).json({ error: 'Erro no login' });
  }
};