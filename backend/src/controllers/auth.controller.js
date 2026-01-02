import { prisma } from '../lib/prisma.js';
import { supabase } from '../lib/supabase.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { name, email, password, bio } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'Email já cadastrado' });

    const uploadToSupabase = async (file, folder) => {
      const cleanFileName = file.originalname.replace(/\s/g, '-');
      const fileName = `${folder}/${Date.now()}-${cleanFileName}`;
      
      const { data, error } = await supabase.storage
        .from('images') 
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error("Erro no Supabase Storage:", error);
        throw new Error('Falha ao fazer upload da imagem no Supabase');
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    };

    let photoUrl = null;
    let bannerUrl = null;

    if (req.files) {
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