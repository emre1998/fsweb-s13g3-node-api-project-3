const express = require('express');
const usersModel = require("./users-model");
const postsModel = require("../posts/posts-model");
const MW = require("../middleware/middleware");
const router = express.Router();

router.get('/', async (req, res,next) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  try{
    let allusers = await usersModel.get();
    res.json(allusers);
  }catch(error){
    next(error)
  }
});

router.get('/:id',MW.validateUserId, (req, res,next) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  try{
    res.json(req.currentUser);
  }catch(error){
    next(error);
  }
});

router.post('/', MW.validateUser, async (req, res,next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  try{
    const insertedUser = await usersModel.insert({name:req.body.name});
    res.status(201).json(insertedUser);
  }catch(error){
    next(error);
  }
});

router.put('/:id', MW.validateUserId,MW.validateUser, async (req, res,next) => {
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try{
    const updatedUser = await usersModel.update(req.params.id,{name:req.body.name});
    res.json(updatedUser);
  }catch(error){
    next(error);
  }
});

router.delete('/:id',MW.validateUserId,async (req, res,next) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try{
    await usersModel.remove(req.params.id);
    res.json(req.currentUser);
  }catch(error){
    next(error)
  }
});

router.get('/:id/posts', MW.validateUserId,async (req, res,next) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try{
    const userPosts = await usersModel.getUserPosts(req.params.id);
    res.json(userPosts);
  }catch(error){
    next(error);
  }
});

router.post('/:id/posts',MW.validateUserId,MW.validatePost,async (req, res,next) => {
  // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try{
    const insertedPost = await postsModel.insert({user_id:req.params.id,text:req.body.text});
    res.status(201).json(insertedPost);
  }catch(error){
    next(error);
  }
});

// routerı dışa aktarmayı unutmayın
module.exports =router;