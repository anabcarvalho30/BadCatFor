import { prisma } from '../lib/prisma.js';
import { supabase } from '../lib/supabase.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { name, email, password, bio } = req.body;

  try {
    // 1. Verifica se usuário existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'Email já cadastrado' });

    // --- LÓGICA DE UPLOAD CORRIGIDA PARA O BUCKET 'imagens' ---
    const uploadToSupabase = async (file, folder) => {
      // Remove espaços do nome do arquivo para evitar erros de URL
      const cleanFileName = file.originalname.replace(/\s/g, '-');
      const fileName = `${folder}/${Date.now()}-${cleanFileName}`;
      
      // AQUI ESTAVA O ERRO: Mudamos de 'uploads' para 'imagens'
      const { data, error } = await supabase.storage
        .from('imagens') 
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error("Erro no Supabase Storage:", error);
        throw new Error('Falha ao fazer upload da imagem no Supabase');
      }

      // Pega a URL pública do bucket 'imagens'
      const { data: urlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    };

    let photoUrl = null;
    let bannerUrl = null;

    // Se houver arquivos, faz o upload
    if (req.files) {
      // Nota: As pastas 'profiles' e 'banners' são criadas automaticamente pelo Supabase
      // se não existirem, desde que o bucket 'imagens' exista.
      if (req.files['photo']) {
        photoUrl = await uploadToSupabase(req.files['photo'][0], 'profiles');
      }
      if (req.files['banner']) {
        bannerUrl = await uploadToSupabase(req.files['banner'][0], 'banners');
      }
    }
    // -----------------------------------------------------------

    const hash = await bcrypt.hash(password, 10);

    // Cria usuário no banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hash,
        bio: bio || null,
        photo: photoUrl,
        banner: bannerUrl,
      },
    });

    user.passwordHash = undefined;
    return res.status(201).json(user);

  } catch (error) {
    console.error("ERRO CRÍTICO NO REGISTRO:", error);
    return res.status(500).json({ 
      error: 'Erro ao registrar usuário', 
      details: error.message 
    });
  }
};

export const login = async (req, res) => {
    // ... manter seu login igual ...
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
        return res.status(500).json({ error: 'Erro no login' });
    }
};