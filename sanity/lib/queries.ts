import { defineQuery } from 'next-sanity';

/* 
explain the query:
_type == "startup" : type of the document == 'startup'
defined(slug.current) : the slug of the document should exist
!defined($search) : if there is not search term exist, stop the filter till this point,
otherwise:
title match $search : Searches title, returning true if a match is found; otherwise it returns false, if false go the followed search ( category ) ..etc
see: https://www.sanity.io/docs/groq-operators#429fa3c5c84d
*/
export const STARTUPS_QUERY =
	defineQuery(`*[_type == "startup" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search] | order(_createdAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    },
    views,
    description,
    category,
    image,
    }    
    `);

export const STARTUP_BY_ID_QUERY =
	defineQuery(`*[_type == "startup" && _id == $id][0] {
    _id,
    title,
    slug,
    _createdAt,
    author -> {
      _id, name, username, image, bio
    },
    views,
    description,
    category,
    image,
    pitch
    }    
    `);

export const STARTUP_VIEWS_QUERY =
	defineQuery(`*[_type == "startup" && _id == $id][0] {
      _id,
      views
      }    
      `);

// _type, _updatedAt, _rev

export const AUTHOR_BY_GITHUB_ID_QUERY =
	defineQuery(`*[_type == "author" && id == $id][0] {
      _id,
      id,
      name, 
      username, 
      email,
      image,
      bio
      }    
      `);

export const AUTHOR_BY_ID_QUERY =
	defineQuery(`*[_type == "author" && _id == $id][0] {
    _id,
    id,
    name, 
    username, 
    email,
    image,
    bio
    }    
    `);

export const STARTUPS_BY_AUTHOR_QUERY =
	defineQuery(`*[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    },
    views,
    description,
    category,
    image,
    }    
    `);

export const PLAYLIST_BY_SLUG_QUERY =
	defineQuery(`*[_type == "playlist" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      select[]-> {
        _id,
        _createdAt,
        title,
        slug,
        author -> {
          _id, name, image, bio
        },
        views,
        description,
        category,
        image,
        pitch
        }
      }    
      `);
