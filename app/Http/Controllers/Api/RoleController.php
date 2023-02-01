<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public static function Routes() 
    {
        Route::group(['middleware' => ['can:role.view']], function () {
            Route::get('/roles', [RoleController::class, 'index']);
            Route::get('/roles/{id}', [RoleController::class, 'show']);
        });
        Route::post('/roles', [RoleController::class, 'store'])->middleware('can:role.add');
        Route::put('/roles/{id}', [RoleController::class, 'update'])->middleware('can:role.edit');
        Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->middleware('can:role.delete');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return RoleResource::collection(Role::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:roles,name'
        ]);
        if($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        Log::create([
            'slug' => 'create',
            'model' => (new Role)->getTable(),
            'user_id' => Auth::user()->id,
            'username' => Auth::user()->username,
            'detail' => json_encode(array('id' => $role->id, 'name' => $role->name))
        ]);

        return response(new RoleResource($role), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $role = Role::find($id);
        $role->getAllPermissions();
        return new RoleResource($role);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:roles,name,' . $id
        ]);
        if($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $role = Role::findById($id);
        $role->update([
            'name' => $request->name
        ]);

        Log::create([
            'slug' => 'update',
            'model' => (new Role)->getTable(),
            'user_id' => Auth::user()->id,
            'username' => Auth::user()->username,
            'detail' => json_encode(array('id' => $role->id, 'name' => $role->name))
        ]);

        return new RoleResource($role);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $role = Role::findById($id);
        Log::create([
            'slug' => 'destroy',
            'model' => (new Role)->getTable(),
            'user_id' => Auth::user()->id,
            'username' => Auth::user()->username,
            'detail' => json_encode(array('id' => $role->id, 'name' => $role->name))
        ]);
        $role->delete();
        return response("", 204);
    }
}
